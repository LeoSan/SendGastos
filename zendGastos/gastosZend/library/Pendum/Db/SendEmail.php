<?php
//require_once "Mail.php";
require("phpmailer/class.phpmailer.php");

class Pendum_Db_SendEmail
{
//	const HOST = '10.73.98.42';
	const HOST = 'MXVLMLS03P.pendulum.com.mx';
//	const HOST = '10.73.98.62';

	const PORT = '25';
	
	const USERNAME = "";
	
	const PASSWORD = "";
	
	const AUTH = false;
	
	static protected $instance = null;
	
	private function __construct() { }
	
	public static function getInstance()
	{
		if (!isset(self::$instance)) {
			self::$instance = new self();
		}
		
		return self::$instance;
	}
	
	public function send($mode, $params)
	{
		switch ($mode) {
			case 'smtp':
				$res = $this->sendSmtpEmail($params);
				break;
		}
		return $res;
	}
	
	
	private function sendSmtpEmail($params)
	{
		$params['cc'] = isset($params['cc']) ? $params['cc'] : '';
		//$params['cco'] = isset($params['cco']) ? $params['cco'] : 'idelgado@pendulum.com.mx,jccabrera@pendulum.com.mx';
		$params['cco'] = isset($params['cco']) ? $params['cco'] : '';
		$mail = new PHPMailer();
		$mail->IsSMTP();
		$mail->SMTPAuth = self::AUTH;
		$mail->Host = self::HOST;
		$mail->Username = self::USERNAME;
		$mail->Password = self::PASSWORD;
		$mail->Port = self::PORT;
		$mail->From = $params['from'];
		$mail->FromName = $params['fromName'];
		$to = explode(',', $params['to']);

		if ( !empty($to) ){
			foreach ($to as $email) {
				$mail->AddAddress(trim($email));
			}
		}
		$cc = explode(',', $params['cc']);
		
		if ( !empty($cc) ){
			foreach ($cc as $email) {
				$mail->AddCC(trim($email));
			}
		}
		$cco = array();
		if( $params['cco'] != ""){
			$cco = explode(',', $params['cco']);
		}
		
		if ( count($cco) > 0 ){
			foreach ($cco as $email) {
				$mail->AddBCC(trim($email));
			}
		}
		$mail->IsHTML(true);
		$mail->Subject = $params['subject'];
		$mail->Body = $params['body'];
		$res = $mail->Send();
		return $res;
	}
}
