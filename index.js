// const crypto = require('crypto')
// // const apiKey = "CKYlAPxISlanLv-yxhl-cg";
// const apiKey = "XjrCEm7gQUGscWUa5U2bPg";
// const apiSecret = "lYpnChSbzTVB6stC5K9geSTU0bfFZQ7Cc8P4";
// // const apiSecret = "8ks5pxQvtqhA4NSn2U4EK6kzC0QVfNJL2iW2";
// const meetingNumber = '89123543956'

// const generateSignature = (apiKey,apiSecret,meetingNumber,role=0)=> {
//   // Prevent time sync issue between client signature generation and zoom 
//   const timestamp = new Date().getTime() - 30000
//   const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
//   const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
//   const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')

//   console.log(signature)
  
//   return signature
// }

// generateSignature(apiKey,apiSecret,meetingNumber)
// import * as KJUR from 'jsrsasign';
const KJUR = require('jsrsasign');
const ZOOM_API_KEY = "VHsHv7K9RdyYmHUwRF78CA"
const ZOOM_API_SECRET = "KTlFIiFo4dEQ5Zge2PDxlOBT9Ztuc6Ir1wJT"
const ZOOM_SDK_KEY = "XFjCnXr6sLPqjqBROQL9c1GRbOlPf0rdh38s"
const ZOOM_SDK_SECRET = "7oX0Jh7GOqjUD54Vi2gWWe8KxI3nOiNQEoho"
 const generateSDKsign = async (number,role) => {

   try {
      const iat = Math.round((new Date().getTime() - 30000) / 1000);
      const exp = iat + 60 * 60 * 2;

      const oHeader = { alg: 'HS256', typ: 'JWT' };

      const oPayload = {
        sdkKey: ZOOM_SDK_KEY,
        mn: number,
        role: role,
        iat: iat,
        exp: exp,
        appKey: ZOOM_SDK_KEY,
        tokenExp: iat + 60 * 60 * 2,
      };

      const sHeader = JSON.stringify(oHeader);
      const sPayload = JSON.stringify(oPayload);
      const signature = KJUR.jws.JWS.sign(
        'HS256',
        sHeader,
        sPayload,
        ZOOM_SDK_SECRET
      );
      console.log(signature);
      return signature
   } catch (error) {
     Logger.error(error)
     return null
   }

};




generateSDKsign('89322919130',0)// from frontend