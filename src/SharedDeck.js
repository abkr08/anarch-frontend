import React, { Component } from "react";
import Cards from "./Cards";
import Button from "./Button";
import "./style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
const images = require.context('../public/cards/', true);
console.log(images)
export default function SharedDeck({ cardSelected }) {
    const isTrue = cardSelected.isTrue;
	return (
        <>
        {
        isTrue?
        <div className="row align-items-start">
        <div className="col">
            <img
            src={images(`./${cardSelected}.png`)}
            alt=''
            className="emptyBox"
            />
        </div>
        <div className="col">
            <img
            src={images(`./default.png`)}
            alt=''
            className="emptyBox"
            />
        </div>
        <div className="col">
            <img
            src={images(`./default.png`)}
            alt=''
            className="emptyBox"
            />
        </div>
        <div className="col">
            <img
            src={images(`./default.png`)}
            alt=''
            className="emptyBox"
            />
        </div>
        </div>:<div className="row align-items-start">
        <div className="col">
            <img
            src={images(`./default.png`)}
            alt=''
            className="emptyBox"
            />
        </div>
        <div className="col">
            <img
            src={images(`./default.png`)}
            alt=''
            className="emptyBox"
            />
        </div>
        <div className="col">
            <img
            src={images(`./default.png`)}
            alt=''
            className="emptyBox"
            />
        </div>
        <div className="col">
            <img
            src={images(`./default.png`)}
            alt=''
            className="emptyBox"
            />
        </div>
        </div>
    }
        
        </>
	)
}
