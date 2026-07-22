from flask import Blueprint, request, jsonify
from db import get_db_connection

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/ai/chat", methods=["POST"])
def ai_chat():

    data = request.json

    user_id = data.get("user_id")
    message = data.get("message", "").lower().strip()

    conn = get_db_connection()
    cur = conn.cursor()

    # ---------------- MEMORIES ----------------

    cur.execute("""
        SELECT memory_text
        FROM memories
        WHERE user_id=%s
        ORDER BY created_at DESC
    """, (user_id,))

    memories = [row[0] for row in cur.fetchall()]

    # ---------------- REMINDERS ----------------

    cur.execute("""
        SELECT
            title,
            reminder_date,
            reminder_time
        FROM reminders
        WHERE user_id=%s
        AND status='pending'
        ORDER BY reminder_date ASC
    """, (user_id,))

    reminders = cur.fetchall()

    # ---------------- MEDICATIONS ----------------

    cur.execute("""
        SELECT
            medicine_name,
            dosage,
            reminder_time
        FROM medications
        WHERE user_id=%s
        AND (
            status='pending'
            OR status IS NULL
        )
        ORDER BY reminder_time ASC
    """, (user_id,))

    medications = cur.fetchall()

    # ---------------- CONTACTS ----------------

    cur.execute("""
        SELECT
            contact_name,
            relationship,
            phone
        FROM emergency_contacts
        WHERE user_id=%s
    """, (user_id,))

    contacts = cur.fetchall()

    cur.close()
    conn.close()

    # ================= WHO AM I =================

    if "who am i" in message:

        for memory in memories:

            if "my name is" in memory.lower():

                name = memory.split("is")[-1].strip()

                return jsonify({
                    "success": True,
                    "reply": f"Your name is {name}."
                })

            if memory.lower().startswith("i am"):

                name = memory[4:].strip()

                return jsonify({
                    "success": True,
                    "reply": f"You are {name}."
                })

    # ================= CONTACTS =================

    for contact in contacts:

        name = contact[0]
        relationship = contact[1].lower()
        phone = contact[2]

        if relationship in message:

            return jsonify({
                "success": True,
                "reply":
                f"Your {relationship} is {name}. Phone number is {phone}."
            })

    if (
        "contact" in message
        or "call" in message
        or "emergency" in message
    ):

        if not contacts:

            return jsonify({
                "success": True,
                "reply":
                "No emergency contacts found."
            })

        contact_text = "\n".join([
            f"{c[1]}: {c[0]} ({c[2]})"
            for c in contacts
        ])

        return jsonify({
            "success": True,
            "reply":
            f"Your emergency contacts are:\n{contact_text}"
        })

    # ================= REMINDERS =================

    if (
        "reminder" in message
        or "task" in message
        or "appointment" in message
    ):

        if not reminders:

            return jsonify({
                "success": True,
                "reply":
                "You have no pending reminders."
            })

        reminder_text = "\n".join([
            f"{r[0]} on {r[1]} at {r[2]}"
            for r in reminders
        ])

        return jsonify({
            "success": True,
            "reply":
            f"You have these reminders:\n{reminder_text}"
        })

    # ================= MEDICATIONS =================

    if (
        "medicine" in message
        or "medication" in message
        or "tablet" in message
        or "pill" in message
    ):

        if not medications:

            return jsonify({
                "success": True,
                "reply":
                "You have no pending medications."
            })

        med_text = "\n".join([
            f"{m[0]} ({m[1]}) at {m[2]}"
            for m in medications
        ])

        return jsonify({
            "success": True,
            "reply":
            f"You should take:\n{med_text}"
        })

    # ================= MEMORY SEARCH =================

    for memory in memories:

        if any(
            word in memory.lower()
            for word in message.split()
        ):

            return jsonify({
                "success": True,
                "reply":
                f"According to your memory, {memory}"
            })

    return jsonify({
        "success": True,
        "reply":
        "I could not find that information in your saved memories."
    })