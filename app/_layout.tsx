import { Link, Stack, usePathname } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const path = usePathname();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f5f3f3ff",
      }}
    >
      <View
        style={{
          backgroundColor: "#00A23D",
          paddingVertical: 10,
          marginHorizontal: 20,
          marginTop: 10,
          borderRadius: 40,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Link href={"/search" as any} asChild>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/Vector-2.png")}
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
              source={require("../assets/images/Vector.png")}
              style={{
                width: 26,
                height: 26,
                tintColor: path === "/" ? "#076110ff" : "#ffffffff",
              }}
            />
          </TouchableOpacity>
        </Link>

        <Link href={"/calendar" as any} asChild>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/Vector-1.png")}
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
