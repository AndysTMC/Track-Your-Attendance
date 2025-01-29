# Track-Your-Attendance

<img src="track-your-attendance-fig.png" width="100%" />

## Description
Track Your Attendance is a web app that helps students manage class schedules and track attendance with real-time updates.

## Features
- Identity
- Upcoming/Ongoing sessions
- Schedule
- Courses Overview
- Attendance Statistics

## Technologies
- Next.js
- Tailwind CSS
- MongoDB
- Redux Toolkit

## Installation
1. Clone the repository
2. Install dependencies
```bash
npm install
```
3. Create a `.env.local` file in the root directory and add the following environment variables
```bash
MONGODB_URI="your_mongodb_uri"
MAX_SCRAPE_RETRY=3 # Preferably 3, Number of times to retry scraping 
MAX_REFETCH_LIMIT=5 # Preferably 5, Number of times to refetch from portal within cooldown time
COOLDOWN_TIME=28800000 # Preferably 28800000, Time in milliseconds to wait before rescraping from portal when refetch limit is reached
ADMIN_PASS="admin_portal_password"
``` 
4. Start the development server
```bash
npm run dev
```

## License
Track Your Attendance is distributed under the terms of the GNU Affero General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

A copy of the GNU Affero General Public License is included with this repository, and can also be found at https://www.gnu.org/licenses/agpl-3.0.en.html.

If you modify and distribute this software, you must include the source code of your modifications and distribute them under the same license.

Please give credit to the original project when using or modifying this software.

For more information, please refer to the [LICENSE](LICENSE) file included in this repository.

## Contributing

We welcome contributions from the community. Please read our [contributing guidelines](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md) before getting started.