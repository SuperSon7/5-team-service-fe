"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BellIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

import PageHeader from "@/components/layout/PageHeader";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api/apiFetch";

type NotificationItem = {
  id: number;
  typeCode: string;
  title: string;
  message: string;
  linkPath: string | null;
  isRead: boolean;
  createdAt: string;
};

type NotificationsResponse = {
  notifications: NotificationItem[];
  hasUnread: boolean;
};

type AlarmTab = "all" | "meeting" | "report";

const formatNotificationTime = (value: string) => {
  if (!value) return "";
  const [datePart, timePart] = value.split("T");
  if (!datePart) return value;
  const [year, month, day] = datePart.split("-");
  const time = timePart ? timePart.slice(0, 5) : "";
  return `${year}년 ${month}월 ${day}일${time ? ` ${time}` : ""}`;
};

const normalizeType = (type: string | null | undefined) => (type ?? "").trim().toUpperCase();

export default function AlarmPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<AlarmTab>("all");
  const { data, isLoading, isError } = useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: () => apiFetch<NotificationsResponse>("/notifications", {}),
  });

  const notifications = useMemo(() => data?.notifications ?? [], [data?.notifications]);
  const meetingCount = useMemo(
    () =>
      notifications.filter(
        (item) => normalizeType(item.typeCode) === "ROUND_START_10M_BEFORE" && !item.isRead,
      ).length,
    [notifications],
  );
  const reportCount = useMemo(
    () =>
      notifications.filter(
        (item) => normalizeType(item.typeCode) === "BOOK_REPORT_CHECKED" && !item.isRead,
      ).length,
    [notifications],
  );
  const allUnreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === "meeting") {
      return notifications.filter(
        (item) => normalizeType(item.typeCode) === "ROUND_START_10M_BEFORE",
      );
    }
    if (activeTab === "report") {
      return notifications.filter((item) => normalizeType(item.typeCode) === "BOOK_REPORT_CHECKED");
    }
    return notifications;
  }, [activeTab, notifications]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="알림" />
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-8 text-gray-400" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="알림" />
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          알림을 불러오지 못했어요.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <PageHeader title="알림" />
      <div className="flex min-h-0 flex-1 flex-col pb-8 pt-4">
        <div className="sticky top-0 z-10 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100">
            <div className=" px-6 flex gap-6">
              {[
                { key: "all" as const, label: "전체", count: allUnreadCount },
                { key: "meeting" as const, label: "모임", count: meetingCount },
                { key: "report" as const, label: "독후감", count: reportCount },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className="relative pb-3 text-label text-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <span className={isActive ? "text-gray-900" : "text-gray-500"}>
                        {tab.label}
                      </span>
                      {tab.count > 0 ? (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-purple px-1.5 text-[11px] font-semibold text-white">
                          {tab.count}
                        </span>
                      ) : null}
                    </div>
                    {isActive ? (
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-primary-purple" />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={async () => {
                await apiFetch("/notifications", { method: "PUT" });
                await queryClient.invalidateQueries({ queryKey: ["notifications"] });
                await queryClient.invalidateQueries({ queryKey: ["notificationsUnread"] });
              }}
              className="px-6 pb-3 text-label text-gray-500"
            >
              모두 읽음 처리
            </button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div
            key={activeTab}
            className="py-10 text-center text-sm text-gray-400 animate-fade-in-up"
          >
            알림이 없어요
          </div>
        ) : (
          <div key={activeTab} className="animate-fade-in-up">
            {filteredNotifications.map((item) => {
              const markAsRead = async () => {
                await apiFetch(`/notifications/${item.id}`, { method: "PUT" });
                await queryClient.invalidateQueries({ queryKey: ["notifications"] });
                await queryClient.invalidateQueries({ queryKey: ["notificationsUnread"] });
              };

              const normalizedType = normalizeType(item.typeCode);
              const icon =
                normalizedType === "ROUND_START_10M_BEFORE" ? (
                  <ClockIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                ) : normalizedType === "BOOK_REPORT_CHECKED" ? (
                  <CheckCircleIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                ) : (
                  <BellIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                );

              const content = (
                <div
                  className={`flex items-start gap-3 border px-4 py-4 ${
                    item.isRead ? "border-gray-200 bg-white" : "border-transparent bg-[#F0F6FF]"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{item.message}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {formatNotificationTime(item.createdAt)}
                    </p>
                  </div>
                  {!item.isRead ? (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-purple" />
                  ) : null}
                </div>
              );

              if (item.linkPath) {
                return (
                  <Link
                    key={item.id}
                    href={item.linkPath}
                    className="block"
                    onClick={async () => {
                      if (!item.isRead) {
                        await markAsRead();
                      }
                    }}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  className="block w-full text-left"
                  onClick={async () => {
                    if (!item.isRead) {
                      await markAsRead();
                    }
                  }}
                >
                  {content}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
