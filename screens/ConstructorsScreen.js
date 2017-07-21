import React from 'react';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import {
  StyleSheet,
  Text,
  View,
  ListView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';

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

  renderRow(standingCell, something, rowID) {
      return (
        <View style={styles.listElem}>

          <View style={styles.standingsOrder}>
            <Text style={{color: 'grey'}}>
              {parseInt(rowID, 10) + 1}
            </Text>
          </View>

          <View style={styles.driverNameBox}>
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.headerText}>
            F1 Portal
          </Text>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>{
            this.state.constructorJson.constructor_standings.MRData
            .StandingsTable.season + " Constructors Championship"}</Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ListView
            flex-start dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
            removeClippedSubviews={false}
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header:{
    backgroundColor: '#F44336',
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  headerText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'normal',
    flex: 1,
    fontSize: 20,
  },
  listHeader:{
    backgroundColor: '#F5F5F5',
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignContent: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#EEEEEE',
  },
  listHeaderText:{
    color: '#F44336',
    textAlign: 'center',
    fontWeight: 'normal',
    flex: 1,
    fontSize: 20,
  },
  listElem:{
    minHeight: 70,
    width: Dimensions.get('window').width,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    alignItems: 'flex-start'
  },
  driverPointsBox:{
    flex: 1,
    alignItems: 'flex-end'
  },
  driverNameBox:{
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  standingsOrder:{
    alignItems: 'flex-start',
    minWidth: 25,
  },
  icon: {
    width: 26,
    height: 26,
  },
});
