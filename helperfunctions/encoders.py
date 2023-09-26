import hashlib

def generate_key(s):
    m = hashlib.sha256()
    m.update(s.encode('utf-8'))
    return m.hexdigest()