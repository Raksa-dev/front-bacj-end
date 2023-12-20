import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  and,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  collectionData,
  collection,
  where,
  query,
  getDocs,
  getCountFromServer,
} from '@angular/fire/firestore';

import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AstrologerService {
  BASE_URL_PROD = 'https://astroraksa.com';
  BASE_URL_LOCAL = 'http://localhost:3000';
  BASE_URL = this.BASE_URL_PROD;
  astrologerBriefDataStore;
  public usernotificationsCount;
  constructor(private firestore: Firestore, private http: HttpClient) {}

  setUserNotificationCount(data) {
    this.usernotificationsCount = data;
  }

  getnotificationCount() {
    return this.usernotificationsCount;
  }

  async getAllAstrologersData() {
    const data = await getDocs(collection(this.firestore, 'astrologers'));
    return data;
  }
  async getAllAstrologersDataFilterApply({
    filterSpecialties,
    filterLanguage,
    yearOption,
    genderOption,
  }) {
    let quearies = [];
    let specialties =
      filterSpecialties.length &&
      quearies.push(
        where('specialties', 'array-contains-any', filterSpecialties)
      );

    let experise =
      yearOption.length &&
      (yearOption == '10'
        ? quearies.push(where('yearsOfExperience', '>=', 10))
        : yearOption == '1and5'
        ? quearies.push(
            and(
              where('yearsOfExperience', '>=', 1),
              where('yearsOfExperience', '<=', 5)
            )
          )
        : quearies.push(
            where('yearsOfExperience', '>=', 5),
            where('yearsOfExperience', '<=', 10)
          ));

    let gender =
      genderOption.length && quearies.push(where('gender', '==', genderOption));

    const dataAstro = collection(this.firestore, 'astrologers');
    let q1 = query(dataAstro, and(...quearies));

    let collectiondata = collectionData(q1);


    return collectiondata;
  }
  async fetchUserNotificatonsCount(id: string) {
    const coll = collection(
      this.firestore,
      'notifications',
      id,
      'notifications'
    );
    const q1 = query(
      coll,
      where('type', '==', 'chat'),
      where('isRead', '==', false)
    );
    const q2 = query(
      coll,
      where('type', '==', 'call'),
      where('isRead', '==', false)
    );
    const getDataForChat = await getCountFromServer(q1);
    const getDataForCall = await getCountFromServer(q2);
    return {
      chatCount: getDataForChat.data().count,
      callCount: getDataForCall.data().count,
    };
  }
  async checkRoomIsPresent(roomCode) {
    const coll = collection(this.firestore, 'chatRooms', roomCode, 'messages');
    const getData = await getDocs(coll);
    return getData;
  }
  async createRoomAndAddMessage(roomId, userData, message?) {
    let isRoomThere = await this.checkRoomIsPresent(roomId);
    let addTextMessage = message ? 'Your Form Data:\n' + message : null;
    if (isRoomThere.size) {
      const coll = collection(this.firestore, 'chatRooms', roomId, 'messages');
      const addMessage = addDoc(coll, {
        text: addTextMessage || 'hi there',
        file_url: '',
        isRead: false,
        mediaUrl: '',
        message: 'hi',
        receiverId: '',
        receiverName: 'some name',
        receiverPhotoUrl: '',
        senderId: userData['uid'],
        senderIsAstrologer: true,
        senderName: userData['firstName'],
        senderPhotoUrl: userData['profilePicUrl']
          ? userData['profilePicUrl']
          : '',
        time: new Date(),
        type: 'text',
      });
      return { isRoomThere: true };
    }
    const coll = collection(this.firestore, 'chatRooms', roomId, 'messages');
    const addMessage = addDoc(coll, {
      text: addTextMessage || 'hi there',
      file_url: '',
      isRead: false,
      mediaUrl: '',
      message: 'hi',
      receiverId: '',
      receiverName: 'some name',
      receiverPhotoUrl: '',
      senderId: userData['uid'],
      senderIsAstrologer: true,
      senderName: userData['firstName'],
      senderPhotoUrl: userData['profilePicUrl']
        ? userData['profilePicUrl']
        : '',
      time: new Date(),
      type: 'text',
    });
    return { isRoomThere: false };
  }
  async generateRoomCodeForCall(roomName) {
    return this.http.post(`${this.BASE_URL}/api/roomcode`, { name: roomName });
  }
  setAstrologerBriefDataStore(data) {
    this.astrologerBriefDataStore = data;
  }
  async allReview(astroId) {
    const coll = collection(this.firestore, 'reviews');
    const q1 = query(coll, where('astrolgerId', '==', astroId));
    const collections = await collectionData(q1);
    return collections;
  }

  get getAstrologerBriefDataStore() {
    return this.astrologerBriefDataStore;
  }
}
