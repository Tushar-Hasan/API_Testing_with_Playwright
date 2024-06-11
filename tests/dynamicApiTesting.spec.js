import path from "path";
import { DateTime } from "luxon";
import { faker } from "@faker-js/faker";
import * as data from "../data/testData.json";
import { test, expect } from "@playwright/test";
import updateJsonFile from "../utils/updateJsonFile";

const bookingBody = require("../data/createBookingbody.json");
const filePath = path.resolve(__dirname, "../data/testData.json");

test("Auth - CreateToken", async ({ request }) => {
  const response = await request.post(`/auth`, {
    data: {
      username: "admin",
      password: "password123",
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  const respJson = await response.json();
  const token = respJson.token;
  await updateJsonFile({ token: token }, filePath);
  expect.soft(response.status()).toBe(200);
  expect.soft(response.ok()).toBeTruthy();
  expect.soft(response.statusText()).toEqual("OK");
});

test("Booking - CreateBooking", async ({ request }) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const totalPrice = faker.number.int(1250);
  const depositPaid = Math.random() < 0.5;
  const checkIn = DateTime.now().toFormat("yyyy-MM-dd");
  const checkOut = DateTime.now().plus({ day: 15 }).toFormat("yyyy-MM-dd");

  const response = await request.post(`/booking`, {
    data: {
      firstname: firstName,
      lastname: lastName,
      totalprice: totalPrice,
      depositpaid: depositPaid,
      bookingdates: {
        checkin: checkIn,
        checkout: checkOut,
      },
      additionalneeds: "Breakfast",
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  console.log(await response.json());
  const responsebody = await response.json();
  expect(response.status()).toBe(200);
  let user_id = await responsebody.bookingid;
  await updateJsonFile({ bookingid: user_id }, filePath);

  expect.soft(response.status()).toBe(200);
  expect.soft(response.ok()).toBeTruthy();
  expect.soft(response.statusText()).toEqual("OK");

  expect.soft(responsebody.booking).toHaveProperty("firstname", firstName);
  expect.soft(responsebody.booking).toHaveProperty("lastname", lastName);
  expect.soft(responsebody.booking).toHaveProperty("totalprice", totalPrice);
  expect.soft(responsebody.booking).toHaveProperty("depositpaid", depositPaid);
  expect
    .soft(responsebody.booking.bookingdates)
    .toHaveProperty("checkin", checkIn);
  expect
    .soft(responsebody.booking.bookingdates)
    .toHaveProperty("checkout", checkOut);
});

test("Booking - UpdateBooking", async ({ request, baseURL }) => {
  const response = await request.put(`${baseURL}booking/${data.bookingid}`, {
    data: bookingBody,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `token=${data.token}`,
    },
  });
  console.log(await response.json());
  const responsebody = await response.json();
  expect.soft(response.status()).toBe(200);
  expect.soft(response.ok()).toBeTruthy();
  expect.soft(response.statusText()).toEqual("OK");
  expect.soft(responsebody).toHaveProperty("firstname", "Cameron");
  expect.soft(responsebody).toHaveProperty("lastname", "Winter");
  expect.soft(responsebody).toHaveProperty("totalprice", 111999);
  expect.soft(responsebody).toHaveProperty("depositpaid", false);
  expect
    .soft(responsebody.bookingdates)
    .toHaveProperty("checkin", "2018-01-01");
  expect
    .soft(responsebody.bookingdates)
    .toHaveProperty("checkout", "2019-01-01");
  expect.soft(responsebody).toHaveProperty("additionalneeds", "Breakfast");
});

test("Booking - GetBooking", async ({ request, baseURL }) => {
  //console.log("id", user_id);

  console.log(`${baseURL}booking/${data.bookingid}`);

  const response = await request.get(`${baseURL}booking/${data.bookingid}`);
  console.log(await response.json());
  const responsebody = await response.json();
  expect.soft(response.status()).toBe(200);
  expect.soft(response.ok()).toBeTruthy();
  expect.soft(response.statusText()).toEqual("OK");

  expect.soft(response.status()).toBe(200);
  expect.soft(response.ok()).toBeTruthy();
  expect.soft(response.statusText()).toEqual("OK");

  expect.soft(responsebody).toHaveProperty("firstname", "Keyeser");
  expect.soft(responsebody).toHaveProperty("lastname", "Durden");
  expect.soft(responsebody).toHaveProperty("totalprice", 111);
  expect.soft(responsebody).toHaveProperty("depositpaid", true);
  expect
    .soft(responsebody.bookingdates)
    .toHaveProperty("checkin", "2018-01-01");
  expect
    .soft(responsebody.bookingdates)
    .toHaveProperty("checkout", "2019-01-01");
  expect.soft(responsebody).toHaveProperty("additionalneeds", "Breakfast");
});
