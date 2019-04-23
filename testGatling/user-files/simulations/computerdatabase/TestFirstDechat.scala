package computerdatabase

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class TestFirstDechat extends Simulation {

	val httpProtocol = http
		.baseUrl("https://arquisoft.github.io")
		.inferHtmlResources(BlackList(""".*\.css""", """.*\.js""", """.*\.ico"""), WhiteList())
		.acceptHeader("image/webp,image/apng,image/*,*/*;q=0.8")
		.acceptEncodingHeader("gzip, deflate")
		.acceptLanguageHeader("es-ES,es;q=0.9")
		.userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36")

	val headers_0 = Map(
		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
		"Upgrade-Insecure-Requests" -> "1")



	val scn = scenario("TestFirstDechat")
		// Inicio
		.exec(http("request_0")
			.get("/dechat_es4a/card")
			.headers(headers_0)
			.check(status.is(404)))
		.pause(1)
		.exec(http("request_1")
			.get("/dechat_es4a/assets/images/messageBubble.png")
			.resources(http("request_2")
			.get("/dechat_es4a/assets/images/chat.png"),
            http("request_3")
			.get("/dechat_es4a/assets/images/messageBubble2.png")))
		.pause(14)
		// Vista del chat
		.exec(http("request_4")
			.get("/dechat_es4a/assets/images/profile.png"))
		.pause(59)
		// vista principal
		// Pestaña documentacion
		.exec(http("request_5")
			.get("/dechat_es4a/assets/statics/docs")
			.headers(headers_0))
		.pause(27)
		.exec(http("request_6")
			.get("/dechat_es4a/")
			.headers(headers_0)
			.resources(http("request_7")
			.get("/dechat_es4a/assets/images/messageBubble2.png"),
            http("request_8")
			.get("/dechat_es4a/assets/images/messageBubble.png"),
            http("request_9")
			.get("/dechat_es4a/assets/images/chat.png")))

	setUp(scn.inject(atOnceUsers(1))).protocols(httpProtocol)
}