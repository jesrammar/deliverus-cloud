/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList, Pressable, View } from 'react-native'

import { getRestaurantSchedules, removeSchedule } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { showMessage } from 'react-native-flash-message'
import DeleteModal from '../../components/DeleteModal'
import scheduleIcon from '../../../assets/schedule.png'

export default function RestaurantSchedulesScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
  const [schedules, setSchedules] = useState([])
  const [scheduleToBeDeleted, setScheduleToBeDeleted] = useState(null)

  useEffect(() => {
    if (loggedInUser) {
      fetchSchedules()
    } else {
      setSchedules([])
    }
  }, [loggedInUser, route])

  const renderSchedule = ({ item }) => {
      return (
          <ImageCard
                imageUri={scheduleIcon}
                title={item.name}
          >
          <TextSemiBold>Start Time: <TextRegular textStyle={styles.productsAssociatedTextStart} > {item.startTime}</TextRegular></TextSemiBold>
          
             
           
           <TextSemiBold>End Time: <TextRegular textStyle={styles.productsAssociatedTextEnd} > {item.endTime}</TextRegular></TextSemiBold>
          
            <TextRegular textStyle={styles.productsAssociatedNumber }>{item.products.length} products associated</TextRegular>
          
           <View style={styles.actionButtonsContainer}>
            <Pressable
              onPress={() => {


                  console.log('EDIT PULSADO')
                  console.log('Restaurante:', route.params.id)
                  console.log('Horario:', item)


                
                navigation.navigate('EditScheduleScreen', {
                              restaurantId: route.params.id,
                              schedule: item
                })}}
              
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandBlueTap
                    : GlobalStyles.brandBlue
                },
                styles.actionButton
              ]}>
            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
              <MaterialCommunityIcons name='pencil' color={'white'} size={20}/>
              <TextRegular textStyle={styles.text}>
                Edit
              </TextRegular>
            </View>
          </Pressable>
  
          <Pressable
              onPress={() => {setScheduleToBeDeleted(item) }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandPrimaryTap
                    : GlobalStyles.brandPrimary
                },
                styles.actionButton
              ]}>
            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
              <MaterialCommunityIcons name='delete' color={'white'} size={20}/>
              <TextRegular textStyle={styles.text}>
                Delete
              </TextRegular>
            </View>
          </Pressable>
          </View>
        </ImageCard>
      )
    }

  const renderEmptySchedulesList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No schedules were retreived. Either you are not logged in or the restaurant has no schedules yet.
      </TextRegular>
    )
  }

  const renderHeader = () => {
    return (
      <>
      {loggedInUser &&
      <Pressable
        onPress={() => navigation.navigate('CreateScheduleScreen', { id: route.params.id })
        }
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? GlobalStyles.brandGreenTap
              : GlobalStyles.brandGreen
          },
          styles.button
        ]}>
        <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
          <MaterialCommunityIcons name='plus-circle' color={'white'} size={20}/>
          <TextRegular textStyle={styles.text}>
            Create schedule
          </TextRegular>
        </View>
      </Pressable>
    }
    </>
    )
  }

  const fetchSchedules = async () => {
    try {
      const fetchedSchedules = await getRestaurantSchedules(route.params.id)
      setSchedules(fetchedSchedules)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant schedule (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }

  }

  const remove = async (schedule) => {
    try {
      await removeSchedule(schedule.restaurantId,schedule.id)
      await fetchSchedules()
      setScheduleToBeDeleted(null)
      showMessage({
        message: `Schedule ${schedule.name} succesfully removed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setScheduleToBeDeleted(null)
      showMessage({
        message: `Schedule ${schedule.name} could not be removed.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }

  }

  return (
    <View style={styles.container}>
    <FlatList
      style={styles.container}
      data={schedules}
      renderItem={renderSchedule}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptySchedulesList}
    />
    <DeleteModal
            isVisible={scheduleToBeDeleted !== null}
            onCancel={() => setScheduleToBeDeleted(null)}
            onConfirm={() => remove(scheduleToBeDeleted)}>
              <TextRegular>If the schedule belong to some order, it cannot be deleted.</TextRegular>
    </DeleteModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '80%'
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    position: 'absolute',
    width: '90%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  productsAssociatedText: {
    textAlign: 'right',
    color: GlobalStyles.brandSecondary
  },
  productsAssociatedTextStart: {
    textAlign: 'left ',
    color: GlobalStyles.brandSuccess
  },
  productsAssociatedTextEnd: {
    textAlign: 'left',
    color: GlobalStyles.brandPrimary
  },
  productsAssociatedTextStart: {
    textAlign: 'left ',
    color: GlobalStyles.brandSuccess
  },
  productsAssociatedNumber: {
    textAlign: 'right',
    color: GlobalStyles.brandSecondary
  }
})
