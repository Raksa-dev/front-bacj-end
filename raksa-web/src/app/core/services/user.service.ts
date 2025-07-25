import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  Firestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  collection,
  where,
  query,
  orderBy,
  increment,
} from '@angular/fire/firestore';
import { limit, startAfter } from 'firebase/firestore';
import { encodeRequest, signRequest } from 'src/app/helpers';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  marchentId = 'RAKSAONLINE';
  saltIndex = 1;
  saltKey = 'ba273d65-f2a8-4b07-86e5-5d9f06390ab3';
  BASE_URL_PROD = 'https://astroraksa.com';
  BASE_URL_LOCAL = 'http://localhost:3000';
  BASE_URL = this.BASE_URL_PROD;
  constructor(private firestore: Firestore, private http: HttpClient) {}

  public userData;

  get getUserData() {
    return this.userData;
  }

  set setUserData(data: any) {
    this.userData = data;
  }

  async getDataFromUserCollection(userId, authData?) {
    const userRef = doc(this.firestore, 'users', userId);
    const data = (await getDoc(userRef)).data();
    let allData = { ...data, phoneNumber: authData };
    return allData;
  }

  async getUserDataInfo(userId) {
    let userData = {};
    const userRef = doc(this.firestore, 'users', userId);
    let data = (await getDoc(userRef)).data();
    userData = { ...data };
    if (data && data['isAstrologer']) {
      const astoRef = doc(this.firestore, 'astrologers', userId);
      const astrodata = (await getDoc(astoRef)).data();
      return astrodata;
    }
    return userData;
  }

  async fetchUserData(userId, authData?) {
    const userRef = doc(this.firestore, 'users', userId);
    const data = (await getDoc(userRef)).data();
    if (data && data['isAstrologer']) {
      // get astolrget data
      const astroRef = doc(this.firestore, 'astrologers', userId);
      const astrodata = (await getDoc(astroRef)).data();
      this.userData = { ...data, ...astrodata, phoneNumber: authData };
    } else {
      this.userData = { ...data, phoneNumber: authData };
    }
    return this.userData;
  }
  async CreateUser(userData: any): Promise<any> {
    const userRef = doc(this.firestore, 'users', userData.uid);
    return setDoc(userRef, userData);
  }
  async UpdateUser(id: string, userData: any): Promise<any> {
    const userRef = doc(this.firestore, 'users', id);
    return updateDoc(userRef, userData);
  }
  async UpdateAstroUser(id: string, userData: any): Promise<any> {
    const userRef = doc(this.firestore, 'astrologers', id);
    return updateDoc(userRef, userData);
  }
  async AddRelatives(id: string, userData: any): Promise<any> {
    const userRef = doc(this.firestore, 'users', id);
    return setDoc(
      userRef,
      { relatives: arrayUnion(userData) },
      {
        merge: true,
      }
    );
  }
  async AdminLinkCreation(code: string): Promise<any> {
    const userRef = doc(this.firestore, 'create_astrologers_form_links', code);

    const saveData = await setDoc(
      userRef,
      {
        code,
        submitted: false,
      },
      {
        merge: true,
      }
    );
    return saveData;
  }
  csvJSON(csv: string) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length - 1; i++) {
      const obj = {};

      const currentLine = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].replace(/\r/g, '')] = currentLine[j].replace(/\r/g, '');
      }

      result.push(obj);
    }
    return result;
  }
  async importDataFromJson() {
    const data = await this.http
      .get('/assets/HoroDetailsupdated.csv', {
        responseType: 'text',
      })
      .toPromise();
    const jsonData = this.csvJSON(data);

    // for (let i = 0; i < jsonData.length; i++) {
    //   let element = jsonData[i];
    //   let yearlycollectinRef = collection(this.firestore, 'learnTab');
    //   let q = query(yearlycollectinRef, where('_id', '==', element['_id']));
    //   const querySnapshot = await getDocs(q);
    //   console.log(element);
    //   querySnapshot.forEach((docq) => {
    //     console.log('docq:', docq.id);
    //     let yearlycollectionRef = doc(this.firestore, 'learnTab', docq.id);
    //     updateDoc(yearlycollectionRef, element);
    //   });
    // }

    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((docq) => {
    //   let yearlycollectinRef = doc(this.firestore, 'learnTab', docq.id);
    //   updateDoc(yearlycollectinRef, element);
    // });

    // jsonData.forEach((element) => {
    //   console.log('elemet', element);
    //   // addDoc(yearlycollectinRef, element);
    // });
    // data.subscribe((dataum: []) => {
    //   // let yearlycollectinRef = collection(
    //   //   this.firestore,
    //   //   'horoscopes',
    //   //   'monthly',
    //   //   'data'
    //   // );
    //   dataum.forEach((element) => {
    //     console.log(element);
    //     // addDoc(yearlycollectinRef, element);
    //   });
    // });
  }
  async CreateAstrologer(userid, data, code): Promise<any> {
    const astroUserRef = doc(this.firestore, 'users', userid);
    const astroRef = doc(this.firestore, 'astrologers', userid);
    const astroLinkRef = doc(
      this.firestore,
      'create_astrologers_form_links',
      code
    );
    setDoc(astroUserRef, {
      isAstrologer: true,
      dateOfBirth: '',
      firstName: '',
      lastName: '',
      birthPlace: '',
      gender: '',
      profilePicUrl: '',
      maritialStatus: '',
      relatives: [],
      walletBalance: 0,
    });
    setDoc(astroRef, data);
    return updateDoc(astroLinkRef, { submitted: true });
  }
  async checkNotificationIsThere(userId, senderId, type) {
    const notificationsRef = collection(
      this.firestore,
      'notifications',
      userId,
      'notifications'
    );
    const q = query(
      notificationsRef,
      where('senderId', '==', senderId),
      where('isRead', '==', false),
      where('type', '==', type)
    );
    const data = await getDocs(q);
    return data;
  }
  async NotifyAstrologerForChat(
    astrologerData,
    userData,
    userId,
    type,
    message?
  ) {
    let userID = userData['uid'] || userId;
    const alreadyNotificationPresent = await this.checkNotificationIsThere(
      astrologerData['uid'],
      userID,
      type
    );
    if (alreadyNotificationPresent?.size) {
      // notification present
      return { notified: true, message: 'Already Notified !!!' };
    } else {
      const notificationsRef = collection(
        this.firestore,
        'notifications',
        astrologerData['uid'],
        'notifications'
      );
      let title =
        `hey greetings ${userData['firstName']}, wants to have ${type} with you` +
        '\n';

      addDoc(notificationsRef, {
        type,
        isRead: false,
        body: `Want to ${type}`,
        date: new Date(),
        title: title,
        senderId: userID,
        senderName: userData['firstName'],
        profilePicUrl: userData['profilePicUrl']
          ? userData['profilePicUrl']
          : '',
        message: message || '',
      });
      return { notified: true, message: 'Notified !!!' };
    }
  }
  async NotifyUserForChat(
    userData,
    notificaitionData,
    type,
    callRoomCode?: String
  ) {
    if (userData && userData?.isAstrologer) {
      const alreadyNotificationPresent = await this.checkNotificationIsThere(
        notificaitionData['senderId'],
        userData['uid'],
        type
      );
      if (alreadyNotificationPresent?.size) {
        return true;
      } else {
        const notificationsRef = collection(
          this.firestore,
          'notifications',
          notificaitionData['senderId'],
          'notifications'
        );
        addDoc(notificationsRef, {
          type,
          isRead: false,
          body: `Want to ${type}`,
          date: new Date(),
          title: `hey ${
            userData['firstName'] + ' ' + userData['lastName']
          } wants to have ${type} with you`,
          senderId: userData['uid'],
          senderName: userData['firstName'],
          profilePicUrl: userData['profilePicUrl']
            ? userData['profilePicUrl']
            : '',
          callRoomCode: type == 'call' ? callRoomCode : '',
        });
        return false;
      }
    }
    return true;
  }
  async MarkNotificationForChatAsRead(userId, NotificationId) {
    const notificationsRef = doc(
      this.firestore,
      'notifications',
      userId,
      'notifications',
      NotificationId
    );
    const update = await updateDoc(notificationsRef, {
      isRead: true,
    });
    return update;
  }
  async GetCcavenuePaymentForm(amount, userId) {
    var randomNumber = Math.floor(Math.random() * 900) + 100;
    const order_ID = `Astro_${randomNumber}_${userId}`;
    return this.http.post(
      `${this.BASE_URL}/api/request`,
      {
        orderParams: {
          order_id: order_ID,
          amount: amount,
          language: 'en',
        },
        keys: {
          working_key: '02182BD7D50FAF0553F00BC70A412F8C',
          access_code: 'AVIA09KI06AB67AIBA',
        },
      },
      {
        responseType: 'text',
      }
    );
  }
  async GetPhonePayPaymentForm(amount, userId) {
    var randomNumber = Math.floor(Math.random() * 900) + 100;
    const order_ID = `pe_${randomNumber}_${userId}`;
    return this.http.post(
      `${this.BASE_URL}/api/phonepe/payu`,
      {
        merchantTransactionId: order_ID,
        merchantUserId: userId,
        amount,
        mobileNumber: '',
      },
      {
        responseType: 'json',
      }
    );
  }
  async GetRazorPayOrderId(amount) {
    return this.http.post(
      `${this.BASE_URL}/api/razorpay`,
      {
        amount,
      },
      {
        responseType: 'json',
      }
    );
  }
  async GetUploadPicLink(formData) {
    return this.http.post(`${this.BASE_URL}/api/upload`, formData);
  }
  async updateUserWalletAmount(
    amount,
    userId,
    order_id,
    tracking_id = '',
    failure_message = '',
    status = '',
    status_message = ''
  ) {
    const userRef = doc(this.firestore, 'users', userId);
    let newAmount = Number((amount / (1 + 18 / 100))?.toFixed(2));
    const updatedData = await setDoc(
      userRef,
      {
        walletBalance: increment(newAmount),
        transactions: arrayUnion(order_id),
      },
      {
        merge: true,
      }
    );
    const transRef = doc(this.firestore, 'transactions', order_id);
    const createTransaction = await setDoc(transRef, {
      id: order_id,
      date: new Date(),
      receiptId: tracking_id,
      rechargeAmount: amount,
      userId: userId,
      status,
      failure_message,
      status_message,
    });

    return updatedData;
  }
  async updateUserWalletAmountForElse(
    amount,
    userId,
    order_id,
    tracking_id = '',
    failure_message = '',
    status = '',
    status_message = ''
  ) {
    const userRef = doc(this.firestore, 'users', userId);
    const updatedData = await setDoc(
      userRef,
      {
        transactions: arrayUnion(order_id),
      },
      {
        merge: true,
      }
    );
    const transRef = doc(this.firestore, 'transactions', order_id);
    const createTransaction = await setDoc(transRef, {
      id: order_id,
      date: new Date(),
      receiptId: tracking_id,
      rechargeAmount: amount,
      userId: userId,
      status,
      failure_message,
      status_message,
    });

    return updatedData;
  }
  async checkForTrx(tranxId) {
    const transRef = doc(this.firestore, 'transactions', tranxId);
    const data = await getDoc(transRef);
    return data.data();
  }
  async createEntryInSession({
    amount,
    astrologerId,
    astrologerName,
    astrologerPic,
    callDuration,
    callerId,
    callerName,
    callerPic,
    sessionType,
    sessionId,
  }) {
    const sessionRef = doc(this.firestore, 'sessions', sessionId);

    return setDoc(sessionRef, {
      amount,
      astrologerId,
      astrologerName,
      astrologerPic,
      callDuration,
      callerId,
      callerName,
      callerPic,
      sessionType,
      id: sessionId,
      date: new Date(),
    });
  }
  async createEntryReview(data) {
    const reviewRef = collection(this.firestore, 'reviews');
    addDoc(reviewRef, { ...data, reviewDate: new Date() });
  }
  async createEntryPayment(data, paymentId) {
    const reviewRef = doc(this.firestore, 'paymentLogs', paymentId);
    setDoc(reviewRef, { id: paymentId, date: new Date(), ...data });
  }
  async getAllBlogsData(entry) {
    let q;
    if (Object.entries(entry).length) {
      q = query(
        collection(this.firestore, 'cutomeblogs'),
        orderBy('title'),
        startAfter(entry?.title),
        limit(8)
      );
    } else {
      q = query(
        collection(this.firestore, 'cutomeblogs'),
        orderBy('title'),
        limit(8)
      );
    }

    const data = await getDocs(q);
    return data;
  }
  async getBlogDataFromSlug(slug) {
    const blogsRef = collection(this.firestore, 'cutomeblogs');
    const q = query(blogsRef, where('slug', '==', slug));
    const data = await getDocs(q);
    return data;
  }
  async addBlogDataFromSlug(data) {
    const reviewRef = collection(this.firestore, 'cutomeblogs');
    let add = await addDoc(reviewRef, data);
    return add;
  }
  async getAllTransactions(userId) {
    const blogsRef = collection(this.firestore, 'transactions');
    const q = query(
      blogsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const data = await getDocs(q);
    return data;
  }

  async getTransaction(id) {
    const blogsRef = doc(this.firestore, 'transactions', id);
    const data = await getDoc(blogsRef);
    return data.data();
  }

  async getAllSessions(userId) {
    const blogsRef = collection(this.firestore, 'sessions');
    const q = query(
      blogsRef,
      where('callerId', '==', userId),
      orderBy('date', 'desc')
    );
    const data = await getDocs(q);
    return data;
  }
  async getAllAstroSessions(userId) {
    const blogsRef = collection(this.firestore, 'sessions');
    const q = query(
      blogsRef,
      where('astrologerId', '==', userId),
      orderBy('date', 'desc')
    );
    const data = await getDocs(q);
    return data;
  }

  // Get userList from Firestore
  async getUserList(userId: string): Promise<any[]> {
    try {
      const userRef = doc(this.firestore, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (userData && userData.userList) {
        return userData.userList;
      }
      return [];
    } catch (error) {
      console.error('Error getting userList:', error);
      return [];
    }
  }

  // Save user data to userList in Firestore
  async saveUserToList(userId: string, userData: any): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', userId);
      const userDoc = await getDoc(userRef);
      const currentUserData = userDoc.data();

      let userList = currentUserData?.userList || [];

      // Check if user already exists in the list
      const existingUserIndex = userList.findIndex(
        (user: any) => user.firstName === userData.firstName
      );

      if (existingUserIndex !== -1) {
        // Update existing user
        userList[existingUserIndex] = userData;
      } else {
        // Add new user
        userList.push(userData);
      }

      // Update the userList in Firestore
      await updateDoc(userRef, { userList });
    } catch (error) {
      console.error('Error saving user to list:', error);
      throw error;
    }
  }
}
