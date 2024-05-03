import { getSocialMediaByUserId } from "~/models/socialMedia.server";
import FacebookImage from "./socialMediaImages/facebook";
import InstagramImage from "./socialMediaImages/instagram";
import XImage from "./socialMediaImages/x";
import { useEffect, useState } from "react";
import { User, getUserById } from "~/models/user.server";
import { socialMedia } from "@prisma/client";

interface UserInfoProps {
  user: any;
  socialMediaLinks: socialMedia | null;
}

export default function UserInfo({ user, socialMediaLinks }: UserInfoProps) {
  return (
    <div className="info h-full place-items-center">
      <h1 className="text-4xl font-semibold pl-96 pt-6 font-serif w-[800px]">
        {user?.firstName + " " + user?.lastName}
      </h1>
      <div className="userName pt-3 flex space-x-2 pl-[400px] w-[800px]">
        <img
          src="https://icons.veryicon.com/png/o/miscellaneous/celestial-phenomena/role-8.png"
          alt="Social Media 1"
          className="w-6 h-6"
        />
        <h2 className="text-base font-semibold text-custom-800 w-[800px]">
          {user?.userName}
        </h2>
      </div>
      <div className="role pt-3 flex space-x-2 pl-[400px] w-[800px]">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///8AAABLS0vi4uI+Pj7o6OiWlpbV1dV0dHSmpqbNzc2AgIC8vLz7+/suLi4ODg709PTc3NzCwsIZGRlERERjY2NaWlrv7++vr69QUFCbm5uPj4+FhYUlJSV6enrGxsZtbW0rKys2Nja0tLSEl6NWAAAFDElEQVR4nO2daXuiOgBGBWEQRAq4oOBSnf//H+e2BMTWbIRLQnjPt4khk/OQfaGLBQAAAGAAlUOn0p25QfjDMPyjO3ODAMPpA8PpMytDL/Q3fuhZa3gJSUh4sdPwkrdB+cVKw3LTBm1KGw29rBOWeRYarotOWLG20DB8CQxhOCWIYZV2wtLKQkP3paVxLTR0jp2wo429heNFbVDkWWnouDEJiV07R22Oc7/e0kV6u95tHXn/x/ae3Ledf9tn+BMYTgMYTh/7DUuGYak7cy/svV7sLgzDy65fovv/xdBl5HRsXBjCEIbagaGSYeTLUZwZOT0XkqlFIxguZZ8bdEyzhKEKMKQBQylgqAQMacBQChgqAUMaMJQChkrAkAYMpYChEjCkMehtBCMN/YCOL5uYkYaDAkMlYDgKMFQChqMAQyVgOAowVAKGo2CyoZ+H1Xn9xbkKc+lJBcFYw3h92CXPw8HbZHdYx/zHfmOmYba6fDi/+bisMv7DPzDQMI29N3YNXpzyk+hinGGR807h7PKCn8wT0wyDFcfvi1UgkaJZhkWYCAg6ThKKv0ajDLPVa/uyPV3LY5zHx/J62r788iHe5JhkGLzUwKSKln5R3wTeFP4yqh7dn13RkmqQYdR9TYcg3fz4fZMGh+4Ljt6m8gtzDPNOGfykVbOiW45zSqRXjDGMnn571tuJ9k9HobdoimHQFtFHyO7S02d7uxWpi4YYZm0jc7pxI99ObXMj0KKaYVi0/fxepBfI9k30Fb9fNMMwbOrWp1irtPxs6mzIj2uCYdDUrL1o17ls3mLCrYomGLZl9CQ+N8qausgtpyYYNj3hg9/IPLk1Ixxer2iAYeoK16kuTd11OfNFAwzjphLKTW3Tpipy1jYMMCQz+g/BcWZLRF6ix46m3zBrmgzp5Jsug90+6TdsGlKppYlvCvLklRlLvyG5MHrokT6ZTF2YkbQbxqQ2ySy9NASkBjPbGu2G5PNPD8k1wm9SMhZasyJpNyQlrfo5oxdhUwmUcN2G/q6OI9tV1JBp8461p6HbMK8L2rbf7s2ynjcnrJGbbsOwzuOp386SX4+/t6zxnm5DUpOu8r3hF8WV1GJGHN2G5EJs2aeheX5N8cyIo9uQdBZHRhQWR353YYhhr73PRTsvmYCh2OLub/LJGNr/Di2uh/a3pfb3h/aPaewfl9o/t7B/fjiDOb796zT2r7UprJf65EnT10vtX/O2f99iBntPPfcPy+nsH7Z7wInUHnCz9z+BPeAZ7OPbfxZjBudpZnAmyv5zbd2ziYmdZxNncL5U8IywP+EzwjM45z2Ds/ozuG8xgzszC/vvPS1E7q650767trD//uE32dXqO6Q1lt8DrrH8LvdgwFAJGI4CDJWA4SjAUAkYjgIMlYDhKBhg6GeMT87yyTiTDt2Gm+Dv591R4f75N2AdqNJsuCx3Sno1u5L1X2g1vB3o2ZbiQN+x0mqYi62OikA/gKnTMBjM7wvaGqpGw4Ke215QVlE1Gg5VBxsoZ//0Gd4GFnSc962NPsM9Pas9ef8HcbUZZg96VnvyeLsgrs0w3NKz2pP3lxK0GbL+Emdf3l6d0WYosk8oy9vDwlYZvj1mDEMYwhCGMIQhDGEIQxjC0GrD88MbmodZ88PRgKESMBwFGCoBw1GAoRIwHAUYKgHDUYChEjAcBRgqAcNRgKESszE0AhjCEIb6gWE/WF8OGBvOtwcBAAAAOf4BfU1dXNJdBOgAAAAASUVORK5CYII="
          alt="Social Media 1"
          className="w-6 h-6"
        />
        <h2 className="text-base font-semibold text-custom-800 w-[800px]">
          {user?.role}
        </h2>
      </div>
      <div className="gmail pt-3 flex space-x-2 pl-[400px] w-[800px]">
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/free-gmail-1664136-1412959.png"
          alt="Social Media 1"
          className="w-6 h-6"
        />
        <h3 className="text-base font-semibold text-custom-800 w-[800px]">
          {user?.email}
        </h3>
      </div>

      <div className="socialMediaLinks pt-3 flex space-x-4 pl-[400px] w-[800px]">
        <InstagramImage />
        <FacebookImage fblink={String(socialMediaLinks?.facebookLink)} />

        <XImage />
      </div>
    </div>
  );
}
