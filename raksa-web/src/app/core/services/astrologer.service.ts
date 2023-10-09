import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
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

@Injectable({
  providedIn: 'root',
})
export class AstrologerService {
  constructor(private firestore: Firestore) {}

  async getAllAstrologersData() {
    const data = await getDocs(collection(this.firestore, 'astrologers'));
    return data;
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
  async createRoomAndAddMessage(roomId, userData) {
    let isRoomThere = await this.checkRoomIsPresent(roomId);
    if (isRoomThere.size) {
      return { isRoomThere: true };
    }
    const coll = collection(this.firestore, 'chatRooms', roomId, 'messages');
    const addMessage = addDoc(coll, {
      text: 'hi there',
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
}
