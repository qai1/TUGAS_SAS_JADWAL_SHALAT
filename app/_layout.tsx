import { Link, Stack, usePathname } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const path = usePathname();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f5f3f3ff", // samakan dengan warna halaman
      }}
    >
      {/* NAVBAR */}
      <View
        style={{
          backgroundColor: "#00A23D",
          marginHorizontal: 20,
          marginTop: 10, // tidak terlalu mepet dengan status bar
          borderRadius: 40,
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {/* SEARCH */}
        <Link href={"/search" as any} asChild>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/Vector.png")}
              style={{
                width: 26,
                height: 26,
                tintColor: path === "/search" ? "#076110ff" : "#ffffffff",
              }}
            />
          </TouchableOpacity>
        </Link>

        <Link href="/" asChild>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/Vector (1).png")}
              style={{
                width: 26,
                height: 26,
                tintColor: path === "/" ? "#076110ff" : "#ffffffff",
              }}
            />
          </TouchableOpacity>
        </Link>

        {/* CALENDAR */}
        <Link href={"/calendar" as any} asChild>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/Vector (2).png")}
              style={{
                width: 26,
                height: 26,
                tintColor: path === "/calendar" ? "#076110ff" : "#ffffffff",
              }}
            />
          </TouchableOpacity>
        </Link>
      </View>

      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
