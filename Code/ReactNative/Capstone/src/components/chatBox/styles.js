import { StyleSheet } from "react-native";
import { color, appStyle } from "../../utility";

export default StyleSheet.create({
  chatContainer: { backgroundColor: color.LIGHT_LIGHT_GRAY, borderRadius: 20 },
  chatTxt: {
    color: color.BLACK,
    fontSize: 16,
    marginVertical: 5,
    fontWeight: "500",
    paddingHorizontal: 10,
  },
});
