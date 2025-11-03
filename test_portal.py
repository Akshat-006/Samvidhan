from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.chrome.options import Options
import time
import sys
import os

# Ask user for browser choice
print("Select Browser: chrome / brave / edge / firefox")
browser = input("Enter browser name: ").strip().lower()

driver = None

# ✅ Chrome
if browser == "chrome":
    print("Launching Chrome...")
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))

# 🦁 Brave
elif browser == "brave":
    print("Launching Brave...")
    brave_path = "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
    if not os.path.exists(brave_path):
        print("❌ Brave browser not found at:", brave_path)
        sys.exit()
    options = Options()
    options.binary_location = brave_path
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

# 🪟 Edge
elif browser == "edge":
    print("Launching Edge...")
    driver = webdriver.Edge(service=EdgeService(EdgeChromiumDriverManager().install()))

# 🦊 Firefox
elif browser == "firefox":
    print("Launching Firefox...")
    driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()))

else:
    print("❌ Invalid browser choice! Please choose chrome / brave / edge / firefox")
    sys.exit()

# -------------------- TEST BEGINS --------------------
driver.get("http://127.0.0.1:5500/frontend/login.html")
driver.maximize_window()

wait = WebDriverWait(driver, 10)

# Check heading text
heading = wait.until(EC.presence_of_element_located((By.TAG_NAME, "h2")))
heading_text = heading.text.strip()
expected_heading = "Hello"  # Change this to match your expected heading

if heading_text == expected_heading:
    print("✅ Heading Matched:", heading_text)
else:
    print("❌ Heading Mismatch!")
    print("Expected:", expected_heading)
    print("Found   :", heading_text)

# Fill login form
driver.find_element(By.ID, "username").send_keys("adminganesh")
driver.find_element(By.ID, "password").send_keys("12345678")

# Click login button (uses Bootstrap class)
driver.find_element(By.CSS_SELECTOR, "button.btn-dark").click()

# Wait and print result
time.sleep(3)
print("Test Passed! Page title after login:", driver.title)

driver.quit()
# -------------------- TEST ENDS --------------------
