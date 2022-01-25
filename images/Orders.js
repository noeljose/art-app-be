import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, Dimensions } from "react-native";

import { API } from "../data";

export default function Orders() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    const datas = JSON.parse(localStorage.getItem("login"));

    await fetch(`${API}/distributer/my_orders`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: datas.data._id }),
    })
      .then((response) => response.json())
      .then((json) => {
        setItems(json.data);
      });
  };

  return (
    <ScrollView
      style={{
        display: "flex",
        flex: 1,
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
      }}
    >
      <View style={styles.heightDivider}></View>
      {items ? (
        <>
          {items.map((val) => {
            return (
              <View style={styles.container} key={val._id}>
                <Text style={styles.title}>{val.product_id}</Text>
                <View style={styles.container2}>
                  <View style={styles.container3}>
                    <Text style={styles.text}> Width: {val.order_details.width} </Text>
                    <Text style={styles.text}> Height: {val.order_details.height} </Text>
                  </View>
                  <View style={styles.container3}>
                    {val.order_details.arcTop ? ( <Text style={styles.text}>Arc Top</Text>  ) : null}
                    {val.order_details.arcBottom ? ( <Text style={styles.text}>Arc Bottom</Text> ) : null}
                  </View>
                  <View style={styles.container3}>
                    {val.order_details.sandwich ? ( <Text style={styles.text}>Sandwitch</Text>  ) : null}
                    {val.order_details.whiteCoat ? ( <Text style={styles.text}>WhiteCoat</Text> ) : null}
                    {val.order_details.varnish ? ( <Text style={styles.text}>Varnish</Text> ) : null}
                  </View>
                </View>
                <View >
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.text}>Status: </Text>
                    {val.status === 0 ? ( <Text style={styles.text}>Not Assigned</Text> ) : null}
                    {val.status === 1 ? ( <Text style={styles.text}>Assigned</Text> ) : null}
                    {val.status === 2 ? ( <Text style={styles.text}>Confirmed</Text>  ) : null}
                    {val.status === 3 ? ( <Text style={styles.text}>First Pay</Text>  ) : null}
                    {val.status === 4 ? ( <Text style={styles.text}>Printing</Text> ) : null}
                    {val.status === 5 ? ( <Text style={styles.text}>Second Pay</Text> ) : null}
                    {val.status === 6 ? ( <Text style={styles.text}>Completed</Text> ) : null}
                  </View>
                  <View>
                    <Text style={styles.text}>Marketeer {val.order_processed_by}</Text>
                  </View>
                </View>

                <View style={styles.heightDivider}></View>
              </View>
            );
          })}
        </>
      ) : (
        <Text style={styles.text}>No Orders Yet</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: Dimensions.get("window").width - 50,
    fontSize: 15,
    borderBottomWidth: 2,
    marginTop: 15,
    marginLeft: 10,
    paddingTop: 15,
    borderBottomColor: "red",
  },
  title: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    marginTop: 5,
    flexDirection: "column",
  },
  heightDivider: {
    height: 20,
  },
  container: {
    borderWidth: 2,
    borderColor: "black",
    padding: 5,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 5,
  },
  container2: {
    borderWidth: 1,
    padding: 5,
    margin: 10,
  },
  container3: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
    marginRight: 10,
  },
  logout: {
    marginBottom: 10,
  },
});
