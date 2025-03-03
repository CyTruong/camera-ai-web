import react, { useState, useEffect } from "react";

import React from "react";

function SearchBar({ data, handleSearchChange, dataType, status }) {
  const [searchInput, setSearchInput] = useState("");

  const motorDataFiltered = () => {
     const dataFiltered = data
      ?.filter((val) => {
        if (
           ( searchInput.length === 0 && ( status === "" ||
            (status ==="in" && !val.exitTime ) ||
            (status ==="out" && val.exitTime)))  ||
            (searchInput.length > 0 && (val.license_plate.toLowerCase().includes(searchInput.toLowerCase()) || val.id + "" === searchInput))
        ) {
          return val;
        }
      });
    handleSearchChange(dataFiltered);
  };
  const clientsDataFiltered = () => {
    const dataFiltered = data
      ?.filter((val) => {
        if (
          [val.client.toLowerCase(), val.client_id + ""].some((r) =>
            r.includes(searchInput.toLowerCase())
          )
        ) {
          return val;
        }
      })
      .reverse();
    handleSearchChange(dataFiltered);
  }

  const ordersDataFiltered = () => {
    const dataFiltered = data
      ?.filter((val) => {
      if (
        val.status.includes(status) &&
        (val.id + "" === searchInput || [val.group_name.toLowerCase()].some((r) =>
        r.includes(searchInput.toLowerCase())
        ))
      ) {
        return val;
      }
      })
      .reverse();
    handleSearchChange(dataFiltered);
  }

  const bannerDataFiltered = () => {
    const dataFiltered = data
      ?.filter((val) => {
        if (
          [val.groupName.toLowerCase(), val.id + ""].some((r) =>
            r.includes(searchInput.toLowerCase())
          )
        ) {
          return val;
        }
      })
      .reverse();
    handleSearchChange(dataFiltered);
  }

  const adsDataFiltered = () => { 
    const dataFiltered = data
      ?.filter((val) => {
        if (
          (val.isActive && status === "True" || !val.isActive && status === "False" || status === "") &&
          [val.id + "", val.title.toLowerCase()].some((r) =>
            r.includes(searchInput.toLowerCase())
          )
        ) {
          return val;
        }
      })
      .reverse();
    handleSearchChange(dataFiltered);
  }

  const discountFiltered = () => {  
    const dataFiltered = data
      ?.filter((val) => {
        if (
          (val.id + "" === searchInput || searchInput === "") 
        ) {
          return val;
        }
      })
      .reverse();
    handleSearchChange(dataFiltered);
  }

  useEffect(() => {
    if(dataType === "orders") {
        ordersDataFiltered();
    }
    if(dataType === "clients") {
        clientsDataFiltered();
    }
    if(dataType === "banner") {
      bannerDataFiltered();
    }
    if(dataType === "ad") {
      adsDataFiltered();
    }
    if(dataType === "discount") {
      discountFiltered();
    }
    if(dataType === "moto") {
      motorDataFiltered();
    }
  }, [searchInput, status]);


  return (
    <>
      <input
        type="text"
        placeholder="Nhập biển số xe"
        onChange={(e) => setSearchInput(e.target.value)}
        value={searchInput}
      />
    </>
  );
}

export default SearchBar;
