"use client";

import { useState, type FormEvent } from "react";
import { site } from "../lib/site";

const whatsappNumber = site.whatsapp.replace(/\D/g, "");

export default function AppointmentRequestForm() {
  const [message, setMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "");
    const topic = String(data.get("topic") ?? "General property consultation");
    const notes = String(data.get("notes") ?? "").trim();

    if (name.length < 2 || !/^\+?[0-9\s().-]{7,20}$/.test(phone) || !date || !time) {
      setMessage("Please enter your name, a valid phone number, preferred date and time.");
      setWhatsappUrl("");
      return;
    }

    const preferredDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(preferredDate.getTime()) || preferredDate < today) {
      setMessage("Choose a date from today onwards.");
      setWhatsappUrl("");
      return;
    }

    const request = [
      "Hello, I would like to request an appointment.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Topic: ${topic}`,
      `Preferred date: ${date}`,
      `Preferred time: ${time}`,
      ...(notes ? [`Additional details: ${notes}`] : []),
    ].join("\n");
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(request)}`;
    setWhatsappUrl(url);
    setMessage("Your request is ready. WhatsApp will open so you can send it and confirm a time.");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="appointment-form" onSubmit={submit}>
      <div className="appointment-form-grid">
        <label>
          Your name
          <input name="name" autoComplete="name" minLength={2} required />
        </label>
        <label>
          Phone or WhatsApp
          <input name="phone" type="tel" autoComplete="tel" placeholder="+971" required />
        </label>
        <label>
          I&apos;d like to discuss
          <select name="topic" defaultValue="Buying a property">
            <option>Buying a property</option>
            <option>Renting a property</option>
            <option>Selling a property</option>
            <option>Property valuation</option>
            <option>Mortgage advice</option>
            <option>General property consultation</option>
          </select>
        </label>
        <label>
          Preferred date
          <input name="date" type="date" required />
        </label>
        <label>
          Preferred time
          <select name="time" defaultValue="" required>
            <option value="" disabled>Select a time</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </label>
      </div>
      <label>
        Anything you&apos;d like us to know? <span className="optional-label">Optional</span>
        <textarea name="notes" rows={3} placeholder="Area, property type, or a question for the team" />
      </label>
      <button className="button button-dark appointment-submit" type="submit">
        Request on WhatsApp <span aria-hidden="true">↗</span>
      </button>
      <p className="appointment-form-note">
        This opens a prepared message in WhatsApp. Your appointment is only confirmed after the team replies.
      </p>
      {message && (
        <p className="appointment-status" role="status">
          {message} {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp ↗</a>}
        </p>
      )}
    </form>
  );
}
