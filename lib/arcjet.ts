import 'server-only';

import arcjet, {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow,
} from '@arcjet/next';

export {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow,
};

export default arcjet({
    key: process.env.ARCJET_KEY as string,
    characteristics: ['fingerprint'],
    //define base rules here, can also be empty if you don't want to have any base rules
    rules: [
        shield({
            mode: 'LIVE',
        }),
    ],
});