import { json } from "@remix-run/node";
import { cors } from "remix-utils";
import db from "../../db.server";
import axios from "axios";

export async function loader({ request }) {
  const shop = process.env.HOST;
  const data = await db.instaFeed.findFirst({ where: { shop: shop } });
  const username = data.instaUsername
  const accessToken =
    "EAAOqIm0DdnIBO49DTkOQQSIieZBxxMxvMO18ziNvjZCaP71vJCekxjPmdb2QSt4if2vuweh093Bm65rK6IMrivp0NB220bmLh1vpZBrYpSNRTbxFOwCNP1iKr8PwEjZAC7ZBZCvUaoQZCVeZC6l0YFlzKQUqxRcql5cuNrGHvyxTBOK5s6nPCCYgv560liMQkMgoQHE7CWLpJGb4GDrTFXIxIS0o4Cr6";
  const instagramAccountId = "17841444577460986";
  let endpoint = `https://graph.facebook.com/v12.0/${instagramAccountId}`;
  let url = `${endpoint}?fields=business_discovery.username(${username}){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}&access_token=${accessToken}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      let array=[];
      const instaData=response.data;
      if (data.instCheckedImageIds != "" && data.instCheckedImageIds != "[]") {
        let pickValue = JSON.parse(data.instCheckedImageIds);
        console.log("in if condition", pickValue);

        for (
          var i = 0; // @ts-ignore
          i < instaData.business_discovery.media.data.length;
          i++
        ) {
          if (
            // @ts-ignore
            pickValue.includes(instaData.business_discovery.media.data[i].id)
          ) {
            // @ts-ignore
            array.push(instaData.business_discovery.media.data[i]);
          }
        }
      } else {
        // @ts-ignore
        array = instaData.business_discovery.media.data;
      }
      data.instaData=array;
      data.instaName = instaData.business_discovery.name;
      data.instaUsername = username;
      return await cors(request,json(data) );
    }
    
  } catch (error) {
   return await cors(request,json(data) );
    // console.log(error, "data not found")
  }
}


