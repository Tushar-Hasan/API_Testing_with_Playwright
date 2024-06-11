import { test, expect } from "@playwright/test";
const fs = require("fs");
import * as data from "../../data/testData.json";
import updateJsonFile from "../../utils/updateJsonFile";
import path from "path";

const filePath = path.resolve(__dirname, "../data/testData.json");

test("Booking - GetBookingIds", async ({ request }) => {
  const response = await request.get(
    "https://restful-booker.herokuapp.com/booking"
  );
  console.log(await response.json());
  expect(response.status()).toBe(200);
});
test("Auth - CreateToken", async ({ request, baseURL }) => {
  const response = await request.post(`${baseURL}auth`, {
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

test("Booking - CreateBooking", async ({ request, baseURL }) => {
  const response = await request.post(`${baseURL}booking`, {
    data: {
      firstname: "Keyeser",
      lastname: "Durden",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Breakfast",
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  console.log(await response.json());
  expect(response.status()).toBe(200);
  let user_id = (await response.json()).bookingid;

  await updateJsonFile({ bookingid: user_id }, filePath);
  expect.soft(response.status()).toBe(200);
  expect.soft(response.ok()).toBeTruthy();
  expect.soft(response.statusText()).toEqual("OK");
});
test("Booking - GetBooking", async ({ request, baseURL }) => {
  //console.log("id", user_id);
  const url = `${baseURL}booking/${data.bookingid}`;
  console.log(url);

  const response = await request.get(url);
  console.log(await response.json());
  expect.soft(response.status()).toBe(200);
  expect.soft(response.ok()).toBeTruthy();
  expect.soft(response.statusText()).toEqual("OK");
});

test("Booking - UpdateBooking", async ({ request, baseURL }) => {
  const response = await request.put(`${baseURL}booking/${data.bookingid}`, {
    data: {
      firstname: "Soze",
      lastname: "Durden",
      totalprice: 205,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Breakfast",
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `token=${data.token}`,
    },
  });
  console.log(await response.json());
  expect.soft(response.status()).toBe(200);
  expect.soft(response.ok()).toBeTruthy();
  expect.soft(response.statusText()).toEqual("OK");
});

test("Booking - PartialUpdateBooking", async ({ request, baseURL }) => {
  const response = await request.patch(`${baseURL}booking/${data.bookingid}`, {
    data: {
      firstname: "Tylar",
      depositpaid: false,
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `token=${data.token}`,
    },
  });
  console.log(await response.json());
  expect.soft(response.status()).toBe(200);
  expect.soft(response.ok()).toBeTruthy();
  expect.soft(response.statusText()).toEqual("OK");
});

test("Booking - DeleteBooking", async ({ request, baseURL }) => {
  const response = await request.delete(`${baseURL}booking/${data.bookingid}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `token=${data.token}`,
    },
  });
  expect.soft(response.status()).toBe(201);
  expect.soft(response.statusText()).toEqual("Created");
});
