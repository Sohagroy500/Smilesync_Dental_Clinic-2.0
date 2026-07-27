"""
Python Input Validators for Dental Clinic Customer Data
Strictly Python business rules (no LLM used for validation).
"""

import re
from typing import Dict, List, Tuple, Any

# Standard Email Regex Pattern
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

# Flexible Phone Number Regex Pattern (supports formats like 555-123-4567, +15551234567, (555) 123-4567)
PHONE_REGEX = re.compile(r"^\+?[0-9\s\-\(\)\.]{7,20}$")

def clean_whitespace(text: str) -> str:
    """
    Strips extra leading, trailing, and internal multiple spaces from string input.
    """
    if not text:
        return ""
    return re.sub(r"\s+", " ", text.strip())

def validate_full_name(name: str) -> Tuple[bool, str, str]:
    """
    Validates patient full name.
    Returns: (is_valid, cleaned_name, error_message)
    """
    cleaned = clean_whitespace(name or "")
    if not cleaned:
        return False, "", "Full name is required."
    if len(cleaned) < 2:
        return False, cleaned, "Full name must be at least 2 characters long."
    return True, cleaned, ""

def validate_email(email: str) -> Tuple[bool, str, str]:
    """
    Validates email format using Python regex.
    Returns: (is_valid, cleaned_email, error_message)
    """
    cleaned = clean_whitespace(email or "").lower()
    if not cleaned:
        return False, "", "Email address is required."
    if not EMAIL_REGEX.match(cleaned):
        return False, cleaned, "Invalid email address format (e.g. name@example.com)."
    return True, cleaned, ""

def validate_phone(phone: str) -> Tuple[bool, str, str]:
    """
    Validates phone number using Python regex.
    Returns: (is_valid, cleaned_phone, error_message)
    """
    cleaned = clean_whitespace(phone or "")
    if not cleaned:
        return False, "", "Phone number is required."
    # Strip non-digit characters for length validation
    digits_only = re.sub(r"\D", "", cleaned)
    if len(digits_only) < 7 or len(digits_only) > 15:
        return False, cleaned, "Phone number must contain between 7 and 15 digits."
    if not PHONE_REGEX.match(cleaned):
        return False, cleaned, "Invalid phone number format."
    return True, cleaned, ""

def validate_customer_payload(customer_data: Dict[str, Any]) -> Tuple[bool, Dict[str, str], List[str]]:
    """
    Validates all customer information: Full Name, Email, Phone Number.
    Strips extra whitespace.
    Returns: (is_all_valid, cleaned_data_dict, list_of_error_messages)
    """
    errors: List[str] = []
    cleaned_data: Dict[str, str] = {}

    # Validate Name
    raw_name = customer_data.get("full_name") or customer_data.get("name") or ""
    is_name_valid, name_clean, name_err = validate_full_name(raw_name)
    if not is_name_valid:
        errors.append(name_err)
    else:
        cleaned_data["full_name"] = name_clean

    # Validate Email
    raw_email = customer_data.get("email") or ""
    is_email_valid, email_clean, email_err = validate_email(raw_email)
    if not is_email_valid:
        errors.append(email_err)
    else:
        cleaned_data["email"] = email_clean

    # Validate Phone
    raw_phone = customer_data.get("phone") or customer_data.get("phone_number") or ""
    is_phone_valid, phone_clean, phone_err = validate_phone(raw_phone)
    if not is_phone_valid:
        errors.append(phone_err)
    else:
        cleaned_data["phone"] = phone_clean

    is_all_valid = len(errors) == 0
    return is_all_valid, cleaned_data, errors
