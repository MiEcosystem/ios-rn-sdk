import React, { Component } from 'react'

import {
   View,
   Text,
   StyleSheet,
   ScrollView
} from 'react-native'

class MyPresentationalComponent extends Component {




render(){
  return (
     <View style={styles.container}>
        <ScrollView ref= 'listview'>
           
        </ScrollView>
     </View>
  )
}

}

const styles = StyleSheet.create ({
   container: {
      marginTop: 50,
      height: 500,
      backgroundColor: 'silver'
   },
   item: {
      margin: 15,
      padding: 15,
      height: 40,
      borderColor: 'red',
      borderWidth: 1
   }
})

module.exports = {
  component: MyPresentationalComponent
}
