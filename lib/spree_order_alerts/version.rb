module SpreeOrderAlerts
  module_function

  # Returns the version of the currently loaded SpreeOrderAlerts as a
  # <tt>Gem::Version</tt>.
  def version
    Gem::Version.new VERSION::STRING
  end

  module VERSION
    MAJOR = 0
    MINOR = 0
    TINY  = 20
    PRE   = 'alpha'.freeze

    STRING = [MAJOR, MINOR, TINY, PRE].compact.join('.')
  end
end
