export type InquiryPayload = {
  purpose: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  contactMethod: string;
  sourcePage?: string;
  propertyId?: string;
  propertyReference?: string;
  viewingDate?: string;
  viewingTime?: string;
};

export type InquiryResult = {
  submitted: false;
  message: string;
};

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResult> {
  if (!payload.name.trim() || !payload.email.trim()) {
    return {
      submitted: false,
      message: "A name and valid email address are required.",
    };
  }

  return {
    submitted: false,
    message: "Your details are valid, but this website is not connected to an inquiry service. Nothing has been sent or saved.",
  };
}
