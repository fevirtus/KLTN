import { StyleSheet } from "react-native";
import { appStyle, color } from "../../utility";

export default StyleSheet.create({
  input: {
    paddingLeft: 16,
    backgroundColor: color.LIGHT_LIGHT_GRAY,
    width: "90%",
    color: color.BLACK,
    height: appStyle.fieldHeight,
    alignSelf: "center",
    marginVertical: appStyle.fieldMarginVertical,
    fontSize: 16,
  },
});
