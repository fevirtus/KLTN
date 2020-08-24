import { StyleSheet } from "react-native";
import { color } from "../../utility";

export default StyleSheet.create({
  cardStyle: {
    // backgroundColor: color.SEMI_TRANSPARENT,
    borderBottomWidth: 1,
    borderColor: color.SILVER,
  },
  cardItemStyle: {
    // backgroundColor: color.SEMI_TRANSPARENT,
  },

  logoContainer: {
    height: 60,
    width: 60,
    borderColor: color.WHITE,
    borderWidth: 2,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.PINK,
  },
  thumbnailName: {
    fontSize: 30,
    color: color.WHITE,
    fontWeight: "bold"
  },
  profileName: {
    fontSize: 20,
    color: color.BLACK,
    fontWeight: "bold"
  },
  newMatch: {
    color: color.RED,
    fontWeight: 'bold',
    fontSize: 15,
    transform: [{ rotate: '-30deg' }],
    // width: 20,
    borderColor: color.RED,
    borderWidth: 1,
    padding: 3,
    position: 'absolute',
    right: 0,
    borderRadius: 10,
  }
});
