"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";

import PageHeader from "@/components/layout/PageHeader";
import Toast from "@/components/common/Toast";
import ProfileForm, { ProfileFormValues } from "@/components/my/profile/ProfileForm";
import ProfileFormActionButtons from "@/components/my/profile/ProfileFormActionButtons";
import { apiFetch } from "@/lib/api/apiFetch";
import { Profile } from "@/components/my/profile/types";
import { uploadImageToS3 } from "@/lib/uploadImageToS3";

const MAX_FILE_SIZE = 5 * 1024 * 1024; //5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

const profileSchema = z.object({
  nickname: z.string().min(1, "닉네임을 입력해주세요.").max(20, "최대 20자까지 입력 가능합니다."),
  leaderIntro: z.string().max(300, "최대 300자까지 입력 가능합니다."),
  memberIntro: z.string().max(300, "최대 300자까지 입력 가능합니다."),
  profileImagePath: z.string().nullable(),
  profileImageFile: z
    .instanceof(File)
    .nullable()
    .refine((file) => !file || ALLOWED_MIME_TYPES.includes(file.type), {
      message: "프로필 이미지는 JPG/JPEG 또는 PNG 파일만 업로드할 수 있습니다.",
    })
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "프로필 이미지는 최대 10MB까지 업로드할 수 있습니다.",
    }),
});

type ProfileUpdatePayload = {
  nickname: string;
  profileImagePath: string | null;
  leaderIntro: string;
  memberIntro: string;
};

export default function ProfileEdit() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [toastMessage, setToastMessage] = useState("");

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await apiFetch<Profile>("/users/me", {});
      return profile;
    },
  });

  const form = useForm<ProfileFormValues>({
    mode: "onChange",
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: "",
      profileImagePath: "",
      profileImageFile: null,
      leaderIntro: "",
      memberIntro: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        nickname: data.nickname ?? "",
        profileImagePath: data.profileImagePath ?? "",
        profileImageFile: null,
        leaderIntro: data.leaderIntro ?? "",
        memberIntro: data.memberIntro ?? "",
      });
    }
  }, [data, form]);

  const handleSave = form.handleSubmit(async (values) => {
    try {
      let profileImagePath = values.profileImagePath ?? null;

      if (values.profileImageFile instanceof File) {
        const { publicUrl } = await uploadImageToS3({
          file: values.profileImageFile,
          directory: "PROFILE",
        });

        profileImagePath = publicUrl;

        form.setValue("profileImagePath", publicUrl, { shouldDirty: true, shouldValidate: true });
        form.setValue("profileImageFile", null, { shouldDirty: true, shouldValidate: true });
      }

      const payload: ProfileUpdatePayload = {
        nickname: values.nickname,
        profileImagePath: profileImagePath,
        leaderIntro: values.leaderIntro,
        memberIntro: values.memberIntro,
      };

      const profile = await apiFetch<Profile>("/users/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (profile) {
        queryClient.setQueryData(["profile"], profile);
      }

      setToastMessage("정상적으로 저장되었습니다.");
      setTimeout(() => setToastMessage(""), 2000);
    } catch (error) {
      console.log(error);
      setToastMessage("저장에 실패했습니다. 다시 시도해주세요!");
      setTimeout(() => setToastMessage(""), 2000);
    }
  });

  return (
    <div className="relative flex h-dvh flex-col bg-white">
      <PageHeader title="프로필 수정" />
      <FormProvider {...form}>
        <div className="flex min-h-0 flex-1 flex-col mt-5 overflow-y-auto px-6 pb-8 pt-6">
          <div className="flex-1">
            <ProfileForm />
          </div>
          <div className="mt-auto">
            <ProfileFormActionButtons
              isValid={form.formState.isValid}
              onCancel={() => router.push("/my")}
              onSave={handleSave}
            />
          </div>
        </div>
      </FormProvider>
      <Toast message={toastMessage} />
    </div>
  );
}
