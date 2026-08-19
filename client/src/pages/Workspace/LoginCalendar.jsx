import React, { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "../../api/axiosInstance";

export default function LoginCalendar() {
  const [loginDates, setLoginDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    axiosInstance
      .get("/auth/me/login-history")
      .then(({ data }) => {
        const dates = (data?.data ?? []).map((d) => new Date(d));
        setLoginDates(dates);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#111111] border border-white/8 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-orange-400" />
        <h2 className="text-base font-semibold text-white">Calendar</h2>
      </div>

      {/* Calendar */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Card className="w-full p-0 bg-transparent border-0 shadow-none">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={undefined}
              modifiers={{ loggedIn: loginDates }}
              modifiersClassNames={{
                loggedIn:
                  "[&>button]:bg-orange-500/20 [&>button]:text-orange-300 [&>button]:font-semibold [&>button]:rounded-md",
              }}
              className="text-white w-full [&_table]:w-full [&_td]:w-full [&_th]:w-full [&_td_button]:w-full [&_.rdp-nav]:w-full [&_.rdp-nav]:flex [&_.rdp-nav]:justify-between [&_.rdp-nav_button]:w-7 [&_.rdp-nav_button]:h-7"
            />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="inline-block w-3 h-3 rounded-sm bg-orange-500/20 border border-orange-500/30" />
        <span>Day you logged in</span>
      </div>
    </div>
  );
}
