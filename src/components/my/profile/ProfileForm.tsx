"use client";

import ImageUploader from "@/components/form/ImageUploader";
import TextAreaField from "@/components/form/TextAreaField";
import TextField from "@/components/form/TextField";

export type ProfileFormValues = {
  nickname: string;
  profileImagePath: string | null;
  profileImageFile: File | null;
  leaderIntro: string;
  memberIntro: string;
};

export default function ProfileForm() {
  return (
    <div className="space-y-8 mb-10">
      <ImageUploader urlName="profileImagePath" fileName="profileImageFile" label="프로필 이미지" />

      <TextField
        name="nickname"
        label="닉네임"
        helperText="닉네임은 최대 20자까지만 입력 가능합니다."
        placeholder="닉네임을 입력해주세요"
      />

      <TextAreaField
        name="memberIntro"
        label="모임원 소개글"
        helperText="나를 소개하는 글을 적어보세요!"
        placeholder="모임원 소개글을 입력해주세요"
        maxLength={300}
      />

      <TextAreaField
        name="leaderIntro"
        label="모임장 소개글"
        helperText="모임 정보에 들어갈 모임장 소개글을 적어보세요!"
        placeholder="모임장 소개글을 입력해주세요"
        maxLength={300}
      />
    </div>
  );
}
