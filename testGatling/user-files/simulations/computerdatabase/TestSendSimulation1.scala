package computerdatabase

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class TestSendSimulation1 extends Simulation {

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



	val scn = scenario("TestSendSimulation1")
		.exec(http("request_0")
			.get("/dechat_es4a/")
			.headers(headers_0))
		.pause(1)
		// Selecciono vista Home
		.exec(http("request_1")
			.get("/dechat_es4a/assets/images/messageBubble2.png")
			.resources(http("request_2")
			.get("/dechat_es4a/assets/images/messageBubble.png"),
            http("request_3")
			.get("/dechat_es4a/assets/images/chat.png")))
		.pause(54)
		// Selecciono vista chat
		.exec(http("request_4")
			.get("/dechat_es4a/assets/images/profile.png"))
		.pause(40)
		// vuelvo a home y selecciono Documentation en la barra menu
		.exec(http("request_5")
			.get("/dechat_es4a/assets/statics/docs")
			.headers(headers_0))

	setUp(scn.inject(atOnceUsers(1))).protocols(httpProtocol)
}