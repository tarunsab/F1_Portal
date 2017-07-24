import React from 'react';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ListView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast'
import {styles} from './StandingsStyles.js'

const api = 'https://f1portal.herokuapp.com';

export default class ConstructorsScreen extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Constructors',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../images/icons/car.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
    tabBarPosition: 'bottom',
  };


  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      constructorJson: [],
      isLoading: true,
      refreshing: false,
    };
  }

  componentDidMount() {

    return fetch(api + '/get_standings')
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson),
        this.setState({
          isLoading: false,
          constructorJson: responseJson,

          dataSource: this.state.dataSource.cloneWithRows(
            responseJson.constructor_standings.MRData.StandingsTable
            .StandingsLists[0].ConstructorStandings),

          leadingConstructorPoints: responseJson.constructor_standings
                                    .MRData.StandingsTable
                                    .StandingsLists[0]
                                    .ConstructorStandings[0]
                                    .points,

        });
      })
      .catch((error) => {
        console.error(error);
      });

  }

   _onRefresh() {
    this.setState({refreshing: true});

    fetch(api + '/get_standings')
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson),
        this.setState({
          isLoading: false,
          constructorJson: responseJson,

          dataSource: this.state.dataSource.cloneWithRows(
            responseJson.constructor_standings.MRData.StandingsTable
            .StandingsLists[0].ConstructorStandings),

          leadingConstructorPoints: responseJson.constructor_standings
                                    .MRData.StandingsTable
                                    .StandingsLists[0]
                                    .ConstructorStandings[0]
                                    .points,

        });
      })
      .catch((error) => {
        console.error(error);
      });

    this.refs.refresh_toast.show('Refreshed constructors standings');
    console.log("Refreshed Constructors standings");
    this.setState({refreshing: false});
  }


  renderRow(standingCell, something, rowID) {
      return (
        <View style={styles.listElem}>

          <View style={styles.standingsOrder}>
            <Text style={{color: 'grey'}}>
              {parseInt(rowID, 10) + 1}
            </Text>
          </View>

          <View style={styles.standingsNameBox}>
            <Text>
              {standingCell.Constructor.name}
            </Text>
          </View>

          <View style={styles.driverPointsBox}>

            <Text>
              {standingCell.points}
            </Text>

            {(rowID !== '0') &&

              <Text style={{color: 'grey'}}>
                {'-' + (this.state.leadingConstructorPoints
                  - parseInt(standingCell.points))}
              </Text>

            }


          </View>



        </View>
      )
  }

  render() {

    if (this.state.isLoading) {
      return (
        <View style={styles.spinner}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>

        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>{
            this.state.constructorJson.constructor_standings.MRData
            .StandingsTable.season + " Constructors Standings"}</Text>
        </View>

        <View style={styles.listContainer}>
          <ListView
            flex-start dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
            removeClippedSubviews={false}
            automaticallyAdjustContentInsets={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }

          />
        </View>

        <Toast ref="refresh_toast"/>

      </View>
    );
  }
}
