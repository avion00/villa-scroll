"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { submitInquiry } from "../lib/inquiries";

type InquiryFormProps = {
  propertyId?: string;
  propertyReference?: string;
  purpose?: string;
  sourcePage?: string;
};

export default function InquiryForm({ propertyId, propertyReference, purpose = "General enquiry", sourcePage }: InquiryFormProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const messageText = String(data.get("message") ?? "").trim();
    const consent = data.get("consent") === "on";
    const viewingDate = String(data.get("viewingDate") ?? "");
    const viewingTime = String(data.get("viewingTime") ?? "");
    const dateIsValid = !viewingDate || (
      /^\d{4}-\d{2}-\d{2}$/.test(viewingDate) &&
      new Date(`${viewingDate}T00:00:00`).getTime() >= new Date(new Date().toDateString()).getTime()
    );

    if (
      name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      (phone && !/^\+?[0-9\s().-]{7,20}$/.test(phone)) ||
      messageText.length < 5 ||
      !consent ||
      !dateIsValid ||
      (purpose === "Viewing request" && (!viewingDate || !viewingTime))
    ) {
      setMessage("Please check your name, email, phone (if provided), message, viewing preference and consent before continuing.");
      setSending(false);
      return;
    }

    const result = await submitInquiry({
      purpose,
      name,
      email,
      phone,
      message: messageText,
      contactMethod: String(data.get("contactMethod") ?? "email"),
      sourcePage,
      propertyId,
      propertyReference,
      viewingDate: viewingDate || undefined,
      viewingTime: viewingTime || undefined,
    });
    setMessage(result.message);
    setSending(false);
  };

  return (
    <form className="inquiry-form" onSubmit={submit} noValidate>
      <input type="hidden" name="purpose" value={purpose} />
      {propertyId && <input type="hidden" name="propertyId" value={propertyId} />}
      {propertyReference && <input type="hidden" name="propertyReference" value={propertyReference} />}
      {sourcePage && <input type="hidden" name="sourcePage" value={sourcePage} />}
      <label>Full name<input name="name" type="text" autoComplete="name" minLength={2} required /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
      <label>Phone number <span className="optional-label">Optional</span><input name="phone" type="tel" autoComplete="tel" /></label>
      {purpose === "Viewing request" && <>
        <label>Preferred viewing date<input name="viewingDate" type="date" required /></label>
        <label>Preferred viewing time<select name="viewingTime" required defaultValue=""><option value="" disabled>Select a time</option><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select></label>
      </>}
      <label>Preferred contact method <select name="contactMethod" defaultValue="email"><option value="email">Email</option><option value="phone">Phone</option><option value="either">Either</option></select></label>
      <label>How can we help?<textarea name="message" rows={4} minLength={5} required defaultValue={propertyReference ? `I'm interested in ${propertyReference}.` : ""} /></label>
      <label className="consent-label"><input type="checkbox" name="consent" required /><span>I agree that my information may be used to respond to this enquiry. Read our <Link href="/privacy-policy">privacy notice</Link>.</span></label>
      <button className="button button-dark form-submit" type="submit" disabled={sending}>{sending ? "Checking…" : "Send enquiry"} <span aria-hidden="true">↗</span></button>
      <p className="form-note">Inquiry delivery is not configured. Submissions are not transmitted or stored.</p>
      {message && <p className="form-status" role="status">{message}</p>}
    </form>
  );
}
