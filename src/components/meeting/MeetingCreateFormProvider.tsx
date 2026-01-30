"use client";

import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateMeetingSchema,
  createMeetingDefaultValues,
  type CreateMeetingFormValues,
} from "@/components/meeting/createMeetingSchema";
import { useMeetingCreateStore } from "@/stores/meetingCreateStore";

export default function MeetingCreateFormProvider({ children }: { children: React.ReactNode }) {
  const initialValues = useMemo(() => {
    const stored = useMeetingCreateStore.getState();
    return {
      ...createMeetingDefaultValues,
      ...stored,
      readingGenreId: stored.readingGenreId ?? createMeetingDefaultValues.readingGenreId,
      meetingImageFile: stored.meetingImageFile ?? undefined,
    } as CreateMeetingFormValues;
  }, []);

  const form = useForm<CreateMeetingFormValues>({
    mode: "onChange",
    resolver: zodResolver(CreateMeetingSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      const values = form.getValues();
      useMeetingCreateStore.getState().setAll({
        ...values,
        meetingImageFile: values.meetingImageFile ?? null,
      });
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return <FormProvider {...form}>{children}</FormProvider>;
}
