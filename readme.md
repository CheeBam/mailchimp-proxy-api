# Mailchimp API Proxy

### Use docker-compose to run server
---

#### Start first time
`docker-compose up --build` (with daemon: add `-d`)

#### Default start
`docker-compose up`

#### Default stop
`docker-compose down`

#### Stop with clearing unused images
`docker-compose down --rmi local`

#### Run an interactive prompt in a current service
`docker-compose exec app sh`

---
### Api doc

#### Server healthcheck  
Request: `GET '/'` \
Response: `Hello World! (Current datetime)`

#### Add subscriber to mailchimp audience
Request: `POST '/add_subscriber'` \
Request body: `{ "email" : string }`


Response: Mailchimp api response
