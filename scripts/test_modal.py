import urllib.request

html = urllib.request.urlopen('http://localhost:8000/').read().decode('utf-8')
print("Is resume-modal present?", "id=\"resume-modal\"" in html)
print("Is dev-id-modal present?", "id=\"dev-id-modal\"" in html)
print("Is admin-dashboard-modal present?", "id=\"admin-dashboard-modal\"" in html)
print("Has display:none on resume-modal?", 'id="resume-modal" class="modal-backdrop" hidden style="display:none;"' in html)
print("Has display:none on dev-id-modal?", 'id="dev-id-modal" class="modal-backdrop" hidden style="display:none;"' in html)
print("Has display:none on admin-dashboard-modal?", 'id="admin-dashboard-modal" class="modal-backdrop" hidden style="display:none;"' in html)
