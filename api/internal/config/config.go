package config

type Config struct {
	ServerName string         `mapstructure:"SERVER_NAME"`
	Web        WebConfig      `mapstructure:"WEB"`
	Database   DatabaseConfig `mapstructure:"DATABASE"`
	SentryDSN  string         `mapstructure:"SENTRY_DSN"`
}

type WebConfig struct {
	Host string `mapstructure:"HOST"`
	Port string `mapstructure:"PORT"`
}

func (c WebConfig) Addr() string {
	return c.Host + ":" + c.Port
}

type DatabaseConfig struct {
	URL          string `mapstructure:"URL"`
	MaxOpenConns int    `mapstructure:"MAX_OPEN_CONNS"`
	MaxIdleConns int    `mapstructure:"MAX_IDLE_CONNS"`
}
