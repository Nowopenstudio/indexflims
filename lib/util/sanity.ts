
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from "../../env"
import { createImageUrlBuilder } from '@sanity/image-url'



export const getRange = ((num: any, in_min: any, in_max: any, out_min: any, out_max: any) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
})

export const filterKey = ((array: any, sec: any, term: any) => {
  const results = array.filter(function (entry: any) { return entry[sec] === term; });
  console.log(array)
  return results
})

export const getDate = ((date: any) => {
  const newdate = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
  };
  const dateTimeFormat = new Intl.DateTimeFormat("en-US", options);

  const parts = dateTimeFormat.formatToParts(newdate);
  const partValues = parts.map((p) => p.value);
  console.log(partValues)
  return (`${partValues[0]} ${partValues[2]}`);
})

export const getDateLong = ((date: any) => {
  const newdate = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: 'numeric'
  };
  const dateTimeFormat = new Intl.DateTimeFormat("en-US", options);

  const parts = dateTimeFormat.formatToParts(newdate);
  const partValues = parts.map((p) => p.value);
  console.log(partValues)
  return (`${partValues[0]} ${partValues[2]} ${partValues[3]}  ${partValues[4]}`);
})

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
  perspective: 'published'
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

export const getData = (async (query: any) => {

  const initQuery = query
  const data = await client.fetch(initQuery, {},
    { next: { revalidate: 500 } });
  console.log(data)
  return { data }

})


export const getRandom = (min: any, max: any) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export const getRandomA = (min: any, max: any) => {
  return (Math.random() * (max - min) + min);
}

export const scrolltoHash = (element_id: string) => {
  const element = document.getElementById(element_id)
  setTimeout(function () {
    element?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }, 100)

}

export const scrollToPos = (posY: number) => {
  window.scrollTo({
    top: posY,
    left: 100,
    behavior: "smooth",
  });
}

export default async function addDoc(doc: any) {

  const postDoc = await client.create(doc).then(res => { return res })

}

export const delData = (async (query: any) => {

  const initQuery = query
  const delContent = await client.delete({
    query: `*[_type == "${query}"]`
  })
})



export const sendEmail = (async (profile: any, form: any, contact: any) => {
  console.log("step1", profile)
  try {
    const response = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: profile.email,
        name: profile.firstName,
        subject: form.emailSub,
        message: form.emailer,
        sender: 'ro@nowopen.studio'
      }),
    });

    // handle success
    if (response.ok) {
      console.log('great')
    } else {
      console.log(response)
    }
  }
  catch (error) {
    console.log("Error sending email:", error);

  }

})

export const sendContact = (async (message: any) => {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: message.email,
        name: message.name,
        subject: message.subject,
        message: message.message,
        sender: message.contact
      }),
    });

    // handle success
    if (response.ok) {
      console.log('great')
    } else {
      console.log(response)
    }
  }
  catch (error) {
    console.log("Error sending email:", error);

  }



})
