import { Country, State, City } from "country-state-city";

// ฟังก์ชันดึงข้อมูลประเทศ
export const getAllCountries = () => {
  return Country.getAllCountries();
};

// ฟังก์ชันดึงข้อมูลรัฐตามรหัสประเทศ
export const getStatesOfCountry = (countryCode) => {
  return State.getStatesOfCountry(countryCode);
};

// ฟังก์ชันดึงข้อมูลเมืองตามรหัสประเทศและรหัสรัฐ
export const getCitiesOfState = (countryCode, stateCode) => {
  return City.getCitiesOfState(countryCode, stateCode);
};
