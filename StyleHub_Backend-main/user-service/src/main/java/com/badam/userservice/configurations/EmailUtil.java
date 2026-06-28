package com.badam.userservice.configurations;

import org.springframework.stereotype.Component;

@Component
public class EmailUtil {
	
	
//	private  JavaMailSender javaMailSender;
//
//	public EmailUtil(JavaMailSender javaMailSender) {
//		this.javaMailSender = javaMailSender;
//	}
//
//	public  void sendOtpEmail(String email, String otp) throws MessagingException {
//
//		MimeMessage mimeMessage = javaMailSender.createMimeMessage();
//
//		MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");
//
//		String subject = "Verify OTP";
//		String text = "Your Verification code is : " + otp;
//
//		mimeMessageHelper.setSubject(subject);
//		mimeMessageHelper.setText(text);
//		mimeMessageHelper.setTo(email);
//
//		try {
//
//			javaMailSender.send(mimeMessage);
//
//		} catch (MailException e) {
//
//			throw new MailSendException(e.getMessage());
//		}
//
//
//	}

}
