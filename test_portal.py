# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager
# import time

# driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# driver.get("http://127.0.0.1:5500/frontend/login.html")
# driver.maximize_window()

# time.sleep(2)

# driver.find_element(By.ID, "username").send_keys("adminganesh")
# driver.find_element(By.ID, "password").send_keys("12345678")

# driver.find_element(By.ID, "submit").click()

# time.sleep(3)
# print("Test Passed! Page title after login:", driver.title)


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

# Setup Chrome driver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get("http://127.0.0.1:5500/frontend/login.html")
driver.maximize_window()

# Wait for page to load
wait = WebDriverWait(driver, 10)

# Check heading text
heading = wait.until(EC.presence_of_element_located((By.TAG_NAME, "h2")))
heading_text = heading.text.strip()

expected_heading = "Hello"

if heading_text == expected_heading:
    print("✅ Heading Matched:", heading_text)
else:
    print("❌ Heading Mismatch!")
    print("Expected:", expected_heading)
    print("Found   :", heading_text)

# Fill login form
driver.find_element(By.ID, "username").send_keys("adminganesh")
driver.find_element(By.ID, "password").send_keys("12345678")

# Click login button (use class selector since no ID was given)
driver.find_element(By.CSS_SELECTOR, "button.btn-dark").click()

# Wait for a moment (or replace with condition for next page)
time.sleep(3)

print("Test Passed! Page title after login:", driver.title)

driver.quit()
