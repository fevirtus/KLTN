import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Card, CardItem, Left, Body, Thumbnail, Right } from "native-base";
import styles from "./styles";

const ShowUsers = ({ name, img, onImgTap, onNameTap, seen }) => {
    return (
        <TouchableOpacity onPress={onNameTap}>
            <Card style={styles.cardStyle} >
                <CardItem style={styles.cardItemStyle}>
                    <Left style={{ flex: 2 }}>
                        <TouchableOpacity style={[styles.logoContainer]} onPress={onImgTap}>
                            {img ? (
                                <Thumbnail source={{ uri: img }} resizeMode="cover" />
                            ) : (
                                    <Text style={styles.thumbnailName}>{name.charAt(0)}</Text>
                                )}
                        </TouchableOpacity>
                        <Body>
                            <Text style={styles.profileName}>
                                {name}
                            </Text>
                        </Body>
                        <Text style={styles.newMatch}>New Match</Text>
                    </Left>
                    {/* <Right>
                        {seen ? null : <Text style={styles.newMatch}>New Match</Text>}
                    </Right> */}
                </CardItem>
            </Card>
        </TouchableOpacity>

    );
};

export default ShowUsers;