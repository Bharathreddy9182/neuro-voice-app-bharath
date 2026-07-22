from flask import Blueprint, request, jsonify
from db import get_db_connection

memories_bp = Blueprint("memories", __name__)

@memories_bp.route("/memories", methods=["POST"])
def create_memory():

    data = request.json

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO memories
        (
            user_id,
            memory_text
        )
        VALUES (%s,%s)
        RETURNING id
    """,
    (
        data["user_id"],
        data["memory_text"]
    ))

    memory_id = cur.fetchone()[0]

    conn.commit()

    cur.close()
    conn.close()

    return jsonify({
        "success": True,
        "id": memory_id
    })


@memories_bp.route("/memories/<int:user_id>", methods=["GET"])
def get_memories(user_id):

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            id,
            memory_text,
            created_at
        FROM memories
        WHERE user_id=%s
        ORDER BY created_at DESC
    """,
    (user_id,)
    )

    rows = cur.fetchall()

    memories = []

    for row in rows:
        memories.append({
            "id": row[0],
            "memory_text": row[1],
            "created_at": str(row[2])
        })

    cur.close()
    conn.close()

    return jsonify(memories)