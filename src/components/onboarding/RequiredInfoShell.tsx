"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import RequiredInfo from "./RequiredInfo";

const requiredInfoSchema = z.object({
  birthYear: z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({ code: "custom", message: "출생년도를 입력해주세요." });
        return;
      }
      if (!/^\d+$/.test(value)) {
        ctx.addIssue({ code: "custom", message: "숫자만 입력해주세요." });
        return;
      }
      if (value.length !== 4) {
        ctx.addIssue({ code: "custom", message: "출생년도는 4자리 숫자여야 합니다." });
        return;
      }
      const parsed = Number(value);
      if (parsed < 1900) {
        ctx.addIssue({ code: "custom", message: "1900보다 작은 값은 입력할 수 없습니다." });
        return;
      }
      if (parsed > 2100) {
        ctx.addIssue({ code: "custom", message: "2100보다 큰 값은 입력할 수 없습니다." });
      }
    }),
  gender: z.enum(["MALE", "FEMALE"]),
  notificationAgreement: z.boolean(),
});

type RequiredInfoValues = z.infer<typeof requiredInfoSchema>;

type ProfileInfo = {
  birthYear: number;
  gender: "MALE" | "FEMALE";
  notificationAgreement: boolean;
};

export default function RequiredInfoShell() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<RequiredInfoValues>({
    resolver: zodResolver(requiredInfoSchema),
    mode: "onChange",
    defaultValues: {
      birthYear: "",
      gender: "MALE",
      notificationAgreement: true,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: ProfileInfo = {
      birthYear: Number(values.birthYear),
      gender: values.gender,
      notificationAgreement: values.notificationAgreement,
    };

    try {
      const profile = await apiFetch("/users/me/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (profile) {
        queryClient.setQueryData(["profile"], profile);
      }
      router.push("/onboarding");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <FormProvider {...form}>
      <RequiredInfo onSubmit={onSubmit} />
    </FormProvider>
  );
}
