"use client";
import { getToken, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';
import { messaging } from '../firebaseConfig';
import { useRouter } from 'next/router';

const NotificationSetup = ({ userId }) => {
  const router = useRouter();

  useEffect(() => {
    const registerServiceWorker = async () => {
      if (typeof navigator !== "undefined" && 'serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered with scope:', registration.scope);

          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('Notification permission granted.');

            if (messaging) {
              const token = await getToken(messaging, {
                vapidKey: 'BB4sQlWDFI_OAz...........eXjpfecmnoJoZ9R7yKuXmoQdt1OW-UhQ',
                serviceWorkerRegistration: registration,
              });

              if (token) {
                console.log('FCM Token:', token);
                saveFcmToken(token);
              } else {
                console.log('No registration token available.');
              }
            } else {
              console.log('Messaging is not initialized.');
            }
          } else {
            console.log('Unable to get permission to notify.');
          }
        } catch (err) {
          console.error('Error during service worker registration or notification permission:', err);
        }
      } else {
        console.log('Service Worker is not supported in this browser.');
      }
    };

    registerServiceWorker();

    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        const { notification, data } = payload;

        if (notification) {
          // Display notification
          showNotification(notification.title, notification.body, data);
        }
      });
    }
  }, [userId]);

  const showNotification = (title, body, data) => {
    const options = {
      body: body,
      data: data, // Attach data to notification for click handling
    };
    const notification = new Notification(title, options);

    notification.onclick = (event) => {
      event.preventDefault(); // Prevent default behavior (open as a tab)
      handleNotificationClick(data);
    };
  };

  const handleNotificationClick = (data) => {
    const { navigationId, trip, userImage, userType, rating, _id, ownerImage, images, offer, type, userId, ratingId, bookingId, ownerId, userdata } = data;

    if (navigationId) {
      switch (navigationId) {
        case 'OwnerTripDetails':
          router.push({
            pathname: '/trip-details',
            query: { booking: JSON.parse(trip), ownerImage: userImage, userType, rating: parseFloat(rating), _id },
          });
          break;
        case 'TripDetails':
          router.push({
            pathname: '/trip-details',
            query: { booking: JSON.parse(trip), ownerImage, userType },
          });
          break;
        case 'OfferDetails':
          router.push({
            pathname: '/boat-details',
            query: { tripDetails: JSON.parse(offer), images: JSON.parse(images), ownerImage, type : 'BoatRequest' },
          });
          break;
        case 'Reviews':
          router.push({
            pathname: '/reviews',
          });
          break;
        case 'LeaveRating':
          router.push({
            pathname: '/reviews',
            query: { ownerId, userType, userId, bookingId },
          });
          break;
        case 'HelpMessage':
          router.push({
            pathname: '/get-help',
          });
          break;
        default:
          console.log('Unknown navigationId:', navigationId);
          break;
      }
    } else {
      console.log('No navigationId provided.');
    }
  };

  const saveFcmToken = async (fcmToken) => {
    if (userId) {
      try {
        const response = await fetch(`https://www.offerboats.com/notification/updateFcmToken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, fcmToken }),
        });

        if (!response.ok) {
          throw new Error('Failed to update FCM token');
        }
        console.log('FCM Token saved successfully:', response.data);
      } catch (error) {
        console.error('Error saving FCM token:', error);
      }
    } else {
      console.log('No userId found.');
    }
  };

  return null;
};

export default NotificationSetup;
