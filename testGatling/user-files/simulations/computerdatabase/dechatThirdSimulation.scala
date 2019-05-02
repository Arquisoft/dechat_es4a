package computerdatabase

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class dechatThirdSimulation extends Simulation {

	val httpProtocol = http
		.baseUrl("https://arquisoft.github.io")
		.inferHtmlResources(BlackList(""".*\.css""", """.*\.js """, """.*\.ico"""), WhiteList())
		.acceptEncodingHeader("gzip, deflate")
		.userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36")

	val headers_0 = Map(
		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
		"Accept-Language" -> "es-ES,es;q=0.9",
		"Upgrade-Insecure-Requests" -> "1")

	val headers_1 = Map(
		"Accept" -> "image/webp,image/apng,image/*,*/*;q=0.8",
		"Accept-Language" -> "es-ES,es;q=0.9")

	val headers_10 = Map(
		"A-IM" -> "x-bm,gzip",
		"Accept-Encoding" -> "gzip, deflate",
		"Proxy-Connection" -> "keep-alive")

    val uri1 = "http://clientservices.googleapis.com/chrome-variations/seed"

	val scn = scenario("dechatThirdSimulation")
		// first - Entramos en nuestra aplicacion
		.exec(http("request_0")
			.get("/dechat_es4a/")
			.headers(headers_0)
			.resources(http("request_1")
			.get("/assets/images/messageBubble.png")
			.headers(headers_1)
			.check(status.is(404)),
            http("request_2")
			.get("/assets/images/messageBubble2.png")
			.headers(headers_1)
			.check(status.is(404)),
            http("request_3")
			.get("/dechat_es4a/assets/images/chat.png")
			.headers(headers_1)))
		.pause(3)
		.exec(http("request_4")
			.get("/assets/images/cosmos.jpg")
			.headers(headers_1)
			.resources(http("request_5")
			.get("/assets/images/profile.png")
			.headers(headers_1)
			.check(status.is(404)))
			.check(status.is(404)))
		.pause(9)
		// second - Selecciono en la barra menu Home
		.exec(http("request_6")
			.get("/assets/images/messageBubble2.png")
			.headers(headers_1)
			.resources(http("request_7")
			.get("/assets/images/messageBubble.png")
			.headers(headers_1)
			.check(status.is(404)))
			.check(status.is(404)))
		.pause(14)
		// third - vuelvo al chat
		.exec(http("request_8")
			.get("/assets/images/cosmos.jpg")
			.headers(headers_1)
			.resources(http("request_9")
			.get("/assets/images/profile.png")
			.headers(headers_1)
			.check(status.is(404)))
			.check(status.is(404)))
		.pause(25)
		// four - añado contactos
		// cierro
		.exec(http("request_10")
			.get(uri1 + "?osname=win&channel=stable&milestone=73")
			.headers(headers_10))
		.pause(37)
		// five - cambio color background
		.exec(http("request_11")
			.get("/assets/images/messageBubble2.png")
			.headers(headers_1)
			.resources(http("request_12")
			.get("/assets/images/messageBubble.png")
			.headers(headers_1)
			.check(status.is(404)))
			.check(status.is(404)))
		.pause(13)
		// six - vuelvo a home y al chat
		.exec(http("request_13")
			.get("/assets/images/cosmos.jpg")
			.headers(headers_1)
			.resources(http("request_14")
			.get("/assets/images/profile.png")
			.headers(headers_1)
			.check(status.is(404)))
			.check(status.is(404)))
		.pause(16)
		// seven - doy a documentacion en la barra menu
		.exec(http("request_15")
			.get("/dechat_es4a/assets/statics/docs")
			.headers(headers_0))
		.pause(14)
		

	setUp(scn.inject(rampUsers(3) during(60))).protocols(httpProtocol)
}