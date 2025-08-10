package config

type Config struct {
	ServerName string         `mapstructure:"SERVER_NAME"`
	Web        WebConfig      `mapstructure:"WEB"`
	Cors       CorsConfig     `mapstructure:"CORS"`
	Database   DatabaseConfig `mapstructure:"DATABASE"`
	Auth0      Auth0Config    `mapstructure:"AUTH0"`
	SentryDSN  string         `mapstructure:"SENTRY_DSN"`
}

type WebConfig struct {
	Host string `mapstructure:"HOST"`
	Port string `mapstructure:"PORT"`
}

func (c WebConfig) Addr() string {
	return c.Host + ":" + c.Port
}

type CorsConfig struct {
	AllowOrigins     []string `mapstructure:"ALLOW_ORIGINS"`
	AllowMethods     []string `mapstructure:"ALLOW_METHODS"`
	AllowHeaders     []string `mapstructure:"ALLOW_HEADERS"`
	ExposeHeaders    []string `mapstructure:"EXPOSE_HEADERS"`
	AllowCredentials bool     `mapstructure:"ALLOW_CREDENTIALS"`
}

type DatabaseConfig struct {
	URL          string `mapstructure:"URL"`
	MaxOpenConns int    `mapstructure:"MAX_OPEN_CONNS"`
	MaxIdleConns int    `mapstructure:"MAX_IDLE_CONNS"`
}

type Auth0Config struct {
	Domain       string `mapstructure:"DOMAIN"`
	ClientID     string `mapstructure:"CLIENT_ID"`
	ClientSecret string `mapstructure:"CLIENT_SECRET"`
	Audience     string `mapstructure:"AUDIENCE"`
	TokenURL     string `mapstructure:"TOKEN_URL"`
}
