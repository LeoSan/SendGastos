<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';


class SendEmail
{
    //*new
    const HOST = 'smtp-relay.gmail.com';
    const PORT = '587';
    const USERNAME = "sis_control_activos@pendulum.com.mx";
    const PASSWORD = "Temporal024+";
    const AUTH = true;
    const SMTPSECURE = 'tls';
    const DEBUG = true;
    /*
    //*old OK*
    const HOST = '10.73.98.68';
	const PORT = '25';
	const USERNAME = "";
	const PASSWORD = "";
	const AUTH = false;
    const SMTPSECURE = '';
    const DEBUG = false;
*/
    static protected $instance = null;

    function __construct() { }

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
        $params['cco'] = 'sistemas_soporte@pendulum.com.mx';
        $mail = new PHPMailer();
        $mail->IsSMTP();
        $mail->SMTPAuth = self::AUTH;
        $mail->Host = self::HOST;
        $mail->Username = self::USERNAME;
        $mail->Password = self::PASSWORD;
        $mail->Port = self::PORT;
        $mail->SMTPSecure = self::SMTPSECURE;
        $mail->SMTPSecure = 'tls';
        $mail->SMTPDebug = self::DEBUG;
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
