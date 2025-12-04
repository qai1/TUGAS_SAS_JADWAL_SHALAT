import { getCurrentIcon } from "@/components/getCurrentIcon";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const toTitleCase = (str = "") =>
  str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export default function Home() {
  const { cityName } = useLocalSearchParams();
  const rawCity = cityName ? String(cityName) : "Kota Jakarta";

  const city = toTitleCase(
    rawCity
      .replace(/^KOTA\s*/i, "")
      .replace(/^KAB(\.|upaten)?\s*/i, "")
      .trim()
  );

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState("");

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateIcon = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchPrayerTimes = async () => {
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=2`
      );
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPrayerTimes();
  }, [city]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (now.getSeconds() === 0) animateIcon();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextPrayer = useMemo(() => {
    if (!data) return null;

    const timings = data.timings;
    const nowMin = timeToMinutes(
      `${currentTime.getHours()}:${currentTime.getMinutes()}`
    );

    const schedule = [
      { name: "Subuh", time: timings.Fajr },
      { name: "Dzuhur", time: timings.Dhuhr },
      { name: "Asar", time: timings.Asr },
      { name: "Maghrib", time: timings.Maghrib },
      { name: "Isya", time: timings.Isha },
    ].map((p) => ({
      ...p,
      min: timeToMinutes(p.time),
    }));

    const upcoming = schedule.find((p) => p.min > nowMin);

    if (upcoming) return { ...upcoming, isTomorrow: false };
    return { ...schedule[0], isTomorrow: true };
  }, [data, currentTime]);

  useEffect(() => {
    if (!nextPrayer) return;

    const interval = setInterval(() => {
      const [hh, mm] = nextPrayer.time.split(":").map(Number);
      const target = new Date();

      target.setHours(hh, mm, 0, 0);
      if (nextPrayer.isTomorrow) target.setDate(target.getDate() + 1);

      const diff = Math.max(target.getTime() - Date.now(), 0);

      const H = Math.floor(diff / 3600000);
      const M = Math.floor((diff % 3600000) / 60000);
      const S = Math.floor((diff % 60000) / 1000);

      setCountdown(
        `${H}:${M.toString().padStart(2, "0")}:${S.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [nextPrayer?.time, nextPrayer?.isTomorrow]);

  const activePrayer = useMemo(() => {
    if (!data) return "";

    const timings = data.timings;
    const nowMin = timeToMinutes(
      `${currentTime.getHours()}:${currentTime.getMinutes()}`
    );

    const list = [
      { key: "Subuh", min: timeToMinutes(timings.Fajr) },
      { key: "Dzuhur", min: timeToMinutes(timings.Dhuhr) },
      { key: "Asar", min: timeToMinutes(timings.Asr) },
      { key: "Maghrib", min: timeToMinutes(timings.Maghrib) },
      { key: "Isya", min: timeToMinutes(timings.Isha) },
    ];

    for (let i = 0; i < list.length; i++) {
      const cur = list[i];
      const next = list[(i + 1) % list.length];

      if (i < list.length - 1) {
        if (nowMin >= cur.min && nowMin < next.min) return cur.key;
      } else {
        if (nowMin >= cur.min || nowMin < list[0].min) return cur.key;
      }
    }

    return "";
  }, [data, currentTime]);

  if (loading || !data || !nextPrayer) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  const { timings, date } = data;
  const iconNow = getCurrentIcon();

  const prayerList = [
    {
      name: "Subuh",
      icon: require("../assets/images/sunrise.png"),
      time: timings.Fajr,
    },
    {
      name: "Dzuhur",
      icon: require("../assets/images/day.png"),
      time: timings.Dhuhr,
    },
    {
      name: "Asar",
      icon: require("../assets/images/afternoon.png"),
      time: timings.Asr,
    },
    {
      name: "Maghrib",
      icon: require("../assets/images/evening.png"),
      time: timings.Maghrib,
    },
    {
      name: "Isya",
      icon: require("../assets/images/night.png"),
      time: timings.Isha,
    },
  ];

  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bigCard}>
        <View>
          <Text style={styles.timeText}>
            {hours}:{minutes}
          </Text>
          <Text style={styles.dateText}>{date.readable}</Text>
          <Text style={styles.city}>{city}</Text>
        </View>

        <View>
          <Animated.Image
            source={iconNow}
            style={{
              width: 70,
              height: 70,
              opacity: fadeAnim,
              resizeMode: "contain",
            }}
          />
          <Text style={styles.countdownTitle}>Menuju {nextPrayer.name}</Text>
          <Text style={styles.countdown}>{countdown}</Text>
        </View>
      </View>

      {prayerList.map((item, i) => (
        <View
          key={i}
          style={[
            styles.prayerCard,
            activePrayer === item.name && styles.activeCard,
          ]}
        >
          <Image
            source={item.icon}
            style={{ width: 40, height: 40, resizeMode: "contain" }}
          />
          <Text style={styles.prayerName}>{item.name}</Text>
          <Text style={styles.prayerTime}>{item.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  bigCard: {
    backgroundColor: "#00A23D",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 35,
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  timeText: { fontSize: 46, color: "white", fontWeight: "bold" },
  dateText: { fontSize: 17, color: "white", marginTop: 8 },
  city: { fontSize: 22, color: "white", marginTop: 4, fontWeight: "500" },

  countdownTitle: { marginTop: 14, color: "white", fontSize: 16 },
  countdown: { color: "white", fontSize: 25, fontWeight: "bold" },

  prayerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },

  activeCard: {
    borderWidth: 2,
    borderColor: "#00A23D",
    backgroundColor: "#E8FCEB",
  },

  prayerName: { flex: 1, fontSize: 20, marginLeft: 15 },
  prayerTime: { fontSize: 20, color: "#888" },
});
