import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

function toArabic(num: number) {
  return num
    .toString()
    .split("")
    .map((d) => arabicNumbers[Number(d)])
    .join("");
}

const ISLAMIC_EVENTS: any = {
  1: { 1: "Tahun Baru Hijriah", 10: "Hari Asyura" },
  3: { 12: "Maulid Nabi" },
  7: { 27: "Isra Mi'raj" },
  8: { 15: "Nisfu Sya'ban" },
  9: { 1: "Awal Ramadan", 17: "Nuzulul Qur'an", 27: "Lailatul Qadar" },
  10: { 1: "Idul Fitri" },
  12: {
    8: "Tarwiyah",
    9: "Arafah",
    10: "Idul Adha",
    11: "Hari Tasyrik",
    12: "Hari Tasyrik",
    13: "Hari Tasyrik",
  },
};

const EVENT_COLORS: any = {
  "Idul Fitri": "#5cb85c",
  "Idul Adha": "#4cae4c",
  Arafah: "#d2b48c",
  "Hari Tasyrik": "#e8d6b5",
  "Lailatul Qadar": "#ffd700",
  "Isra Mi'raj": "#ffe28a",
  "Maulid Nabi": "#8ec9ff",
  "Nisfu Sya'ban": "#ffb87a",
  "Awal Ramadan": "#31c4b2",
  "Nuzulul Qur'an": "#7cc2ff",
  "Hari Asyura": "#ff9bb3",
  "Tahun Baru Hijriah": "#b38bfa",
  Tarwiyah: "#e8d6b5",
};

export default function CalendarPage() {
  const today = new Date();
  const [monthIndex, setMonthIndex] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [hijriData, setHijriData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hijriMonthName, setHijriMonthName] = useState("");
  const [hijriMonthNumber, setHijriMonthNumber] = useState(0);

  useEffect(() => {
    fetchMonth();
  }, [monthIndex, year]);

  const fetchMonth = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/gToHCalendar/${monthIndex}/${year}`
      );
      const json = await res.json();
      setHijriData(json.data);

      setHijriMonthName(json.data[15].hijri.month.en);
      setHijriMonthNumber(Number(json.data[15].hijri.month.number));
    } catch (e) {
      console.log("ERROR:", e);
    }
    setLoading(false);
  };

  const changeMonth = (dir: number) => {
    let newMonth = monthIndex + dir;
    let newYear = year;

    if (newMonth === 13) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth === 0) {
      newMonth = 12;
      newYear -= 1;
    }

    setMonthIndex(newMonth);
    setYear(newYear);
  };

  // Ambil event bulan ini
  const monthEvents = ISLAMIC_EVENTS[hijriMonthNumber] || {};
  const usedEvents = Object.values(monthEvents);

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Text style={styles.navBtn}>⟨</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>{hijriMonthName}</Text>
            <Text style={styles.subtitle}>
              {monthIndex}/{year} (Masehi)
            </Text>
          </View>

          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Text style={styles.navBtn}>⟩</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {["Ahad", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d, i) => (
            <Text key={i} style={styles.weekText}>
              {d}
            </Text>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <View style={styles.grid}>
            {hijriData.map((item, idx) => {
              const hDay = Number(item.hijri.day);
              const hMonth = hijriMonthNumber;

              const eventName =
                ISLAMIC_EVENTS[hMonth] && ISLAMIC_EVENTS[hMonth][hDay]
                  ? ISLAMIC_EVENTS[hMonth][hDay]
                  : null;

              const backgroundColor = eventName
                ? EVENT_COLORS[eventName]
                : "#fff";

              return (
                <View key={idx} style={[styles.dayCircle, { backgroundColor }]}>
                  <Text style={styles.dayText}>{toArabic(hDay)}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* KETERANGAN TANGGAL */}
      {monthEvents && Object.keys(monthEvents).length > 0 && (
        <View style={{ marginTop: 30 }}>
          <Text style={styles.ketTitle}>Keterangan Bulan Ini:</Text>

          {Object.keys(monthEvents).map((d, i) => (
            <Text key={i} style={styles.ketItem}>
              • {d} {hijriMonthName} — {monthEvents[d]}
            </Text>
          ))}
        </View>
      )}

      {/* LEGENDA WARNA EVENT */}
      {usedEvents.length > 0 && (
        <View style={{ marginTop: 25 }}>
          <Text style={styles.ketTitle}>Warna Penanda:</Text>

          {usedEvents.map((evt: any, i: number) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: EVENT_COLORS[evt] || "#ccc",
                  marginRight: 10,
                }}
              />
              <Text style={{ fontSize: 16 }}>{evt}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBtn: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  weekText: {
    width: "14.2%",
    textAlign: "center",
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },
  dayCircle: {
    width: "14.2%",
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
    backgroundColor: "#fff",
    elevation: 2,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "600",
  },
  ketTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ketItem: {
    fontSize: 16,
    marginTop: 5,
  },
});
