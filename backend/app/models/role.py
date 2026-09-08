
from app.extensions import db

class Role(db.Model):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    nama_role = db.Column(db.String(60), nullable=False)
    deskripsi = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.String(32), nullable=True)
    created_by = db.Column(db.String(60), nullable=True)
    updated_at = db.Column(db.String(32), nullable=True)
    updated_by = db.Column(db.String(60), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "nama_role": self.nama_role,
            "deskripsi": self.deskripsi,
            "created_at": self.created_at,
            "created_by": self.created_by,
            "updated_at": self.updated_at,
            "updated_by": self.updated_by,
        }
