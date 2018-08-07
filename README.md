# eNETS_QR_Responsive_Webpage

This interactive site was created to demostrate the functions of each of the eNETS API. The code can be used as reference, but **should not** be copied line for line. The decrepencies lie in the lack of a backend implementation where secret key and other confidential information should be stored and processed. For a comprehensive integration guide, please visit our [developer's portal](https://api-developer.nets.com.sg/). 

## Main use cases
**1. NPS**
- Allows both **UAT** and **Production** testing.
- Contains a responsive layout that provides a QR-code to scan when using a pc browser and a URI to NETSPAY application when using a mobile browser.

**2. SOAPI**
- Allows both **UAT** and **Production** testing.
- Provides implementations in current page and hosted page.
- Enables deeplink URI re-direction to NETSPAY application when selecting QR payment in mobile browser.

**3. HMAC**
- Checks your signature for you.
- Suitable for both NPS and SOAPI.


## Built With

* bootstrap
* jquery
